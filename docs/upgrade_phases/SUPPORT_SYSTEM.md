# Support System Upgrade Phase

## Overview

Add an in-app support widget backed by AirTable for ticket tracking and S3 for file attachments.
Users can submit bug reports, feature requests, and questions directly from any page in the app.

---

## Step 0: AirTable Base Setup (Manual, Pre-Code)

Create a new AirTable base named **"Rooted Support"** with a table named **"Tickets"**.

### Table Fields

| Field Name   | AirTable Field Type                                        |
|--------------|------------------------------------------------------------|
| Subject      | Single line text                                           |
| Type         | Single select: Bug, Feature Request, Question              |
| Description  | Long text                                                  |
| Status       | Single select: Open, In Progress, Resolved (default: Open) |
| Priority     | Single select: Low, Medium, High (default: Medium)         |
| User ID      | Single line text                                           |
| User Email   | Email                                                      |
| Attachments  | Attachment (AirTable native — accepts URLs)                |
| Submitted At | Date (include time)                                        |

### Credentials to Obtain

- `AIRTABLE_PERSONAL_ACCESS_TOKEN` — from airtable.com/create/tokens (scope: `data.records:write`)
- `AIRTABLE_BASE_ID` — from the URL: `airtable.com/{BASE_ID}/...`
- `AIRTABLE_TABLE_NAME` — `"Tickets"`

---

## Step 1: Environment Variables

Add to **`apps/api/.env`**:

```
AIRTABLE_PERSONAL_ACCESS_TOKEN=pat_xxx
AIRTABLE_BASE_ID=app_xxx
AIRTABLE_TABLE_NAME=Tickets
SUPPORT_S3_BUCKET=rooted-support-uploads
SUPPORT_S3_REGION=us-west-2
```

---

## Step 2: Install New npm Packages

Install in `apps/api/`:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

---

## Step 3: Backend — `support-domain`

### Directory Structure

```
apps/api/src/domains/support-domain/
├── types.ts
├── router.ts
├── commands/
│   ├── index.ts
│   ├── getUploadUrl.ts       # Generates presigned S3 PUT URL
│   └── submitTicket.ts       # Posts record to AirTable
└── lib/
    └── airtable-client.ts    # Thin fetch wrapper for AirTable REST API
```

### `types.ts`

```typescript
import { z } from 'zod';

export const getUploadUrlSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1),
});

export const submitTicketSchema = z.object({
  type: z.enum(['Bug', 'Feature Request', 'Question']),
  subject: z.string().min(1).max(255),
  description: z.string().min(1),
  userEmail: z.string().email(),
  attachmentUrls: z.array(z.string().url()).max(5).optional(),
});

export type GetUploadUrlInput = z.infer<typeof getUploadUrlSchema>;
export type SubmitTicketInput = z.infer<typeof submitTicketSchema>;
```

### `router.ts`

Uses `authedProcedure` (not `farmProcedure` — support is not farm-scoped).

```typescript
import { router } from '../../lib/trpc/trpc';
import { authedProcedure } from '../../lib/trpc/procedures';
import { getUploadUrlSchema, submitTicketSchema } from './types';
import { getUploadUrl } from './commands/getUploadUrl';
import { submitTicket } from './commands/submitTicket';

export const supportRouter = router({
  getUploadUrl: authedProcedure
    .input(getUploadUrlSchema)
    .mutation(({ ctx, input }) => getUploadUrl(ctx.userId, input)),

  submitTicket: authedProcedure
    .input(submitTicketSchema)
    .mutation(({ ctx, input }) => submitTicket(ctx.userId, input)),
});
```

Register in **`apps/api/src/lib/trpc/router.ts`**:

```typescript
import { supportRouter } from '../../domains/support-domain/router';

export const appRouter = router({
  // ... existing routers
  support: supportRouter,
});
```

### `commands/getUploadUrl.ts`

- S3 key path: `support/{userId}/{uuid}-{filename}`
- Presigned URL expires in 5 minutes (300 seconds)
- Returns `{ uploadUrl: string, fileUrl: string }`

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { env } from '../../../lib/env';
import type { GetUploadUrlInput } from '../types';

const s3 = new S3Client({ region: env.SUPPORT_S3_REGION });

export async function getUploadUrl(userId: string, input: GetUploadUrlInput) {
  const key = `support/${userId}/${randomUUID()}-${input.filename}`;

  const command = new PutObjectCommand({
    Bucket: env.SUPPORT_S3_BUCKET,
    Key: key,
    ContentType: input.contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  const fileUrl = `https://${env.SUPPORT_S3_BUCKET}.s3.${env.SUPPORT_S3_REGION}.amazonaws.com/${key}`;

  return { uploadUrl, fileUrl };
}
```

### `commands/submitTicket.ts`

Maps `attachmentUrls` to AirTable's `[{ url: "..." }]` attachment format, then calls the AirTable client.

```typescript
import { createAirtableRecord } from '../lib/airtable-client';
import type { SubmitTicketInput } from '../types';

export async function submitTicket(userId: string, input: SubmitTicketInput) {
  await createAirtableRecord({
    Subject: input.subject,
    Type: input.type,
    Description: input.description,
    'User ID': userId,
    'User Email': input.userEmail,
    'Submitted At': new Date().toISOString(),
    ...(input.attachmentUrls?.length
      ? { Attachments: input.attachmentUrls.map((url) => ({ url })) }
      : {}),
  });

  return { success: true };
}
```

### `lib/airtable-client.ts`

Plain `fetch` wrapper — no external SDK needed.

```typescript
import { TRPCError } from '@trpc/server';
import { env } from '../../../lib/env';

export async function createAirtableRecord(fields: Record<string, unknown>) {
  const url = `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${encodeURIComponent(env.AIRTABLE_TABLE_NAME)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `AirTable error ${response.status}: ${body}`,
    });
  }

  return response.json();
}
```

### `commands/index.ts`

```typescript
export { getUploadUrl } from './getUploadUrl';
export { submitTicket } from './submitTicket';
```

---

## Step 4: Frontend — Floating Support Widget

### Directory Structure

```
src/support/
├── SupportWidget.tsx            # Floating button + modal open/close state
└── components/
    └── SupportForm.tsx          # Form with 2-step file upload flow
```

### `SupportWidget.tsx`

- Fixed bottom-right button: `fixed bottom-6 right-6 z-50`
- Uses `HelpCircle` icon from `lucide-react`
- Reads email from `useUser()` (Clerk) to pre-populate form
- Renders `SupportForm` as a modal when open

```tsx
import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { SupportForm } from './components/SupportForm';

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? '';

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90"
        aria-label="Open support"
      >
        <HelpCircle className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <SupportForm userEmail={userEmail} onSuccess={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
```

### `SupportForm.tsx`

Follows the existing `CustomerForm` modal pattern.

**Fields:**
- Type — segmented control or select: Bug / Feature Request / Question
- Subject — text input
- Description — textarea
- Email — pre-filled from Clerk, editable
- Attachments — file input, up to 5 files, `accept="image/*,application/pdf,.txt"`

**Two-step submit flow:**
1. For each selected file: call `trpc.support.getUploadUrl.mutate({ filename, contentType })`, then `fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })`
2. Collect returned `fileUrl`s into `attachmentUrls[]`
3. Call `trpc.support.submitTicket.mutate({ type, subject, description, userEmail, attachmentUrls })`

**UI states:**
- Idle → uploading (show per-file progress count, e.g. "Uploading 2/3…") → submitting → success message → auto-close or manual close

```tsx
import { useState } from 'react';
import { trpc } from '../../lib/trpc';

interface SupportFormProps {
  userEmail: string;
  onSuccess: () => void;
}

export function SupportForm({ userEmail, onSuccess }: SupportFormProps) {
  const [type, setType] = useState<'Bug' | 'Feature Request' | 'Question'>('Question');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState(userEmail);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'submitting' | 'success'>('idle');
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  const getUploadUrl = trpc.support.getUploadUrl.useMutation();
  const submitTicket = trpc.support.submitTicket.useMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      // Step 1: Upload files
      const attachmentUrls: string[] = [];
      if (files.length > 0) {
        setStatus('uploading');
        setUploadProgress({ done: 0, total: files.length });

        for (const file of files) {
          const { uploadUrl, fileUrl } = await getUploadUrl.mutateAsync({
            filename: file.name,
            contentType: file.type,
          });
          await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
          });
          attachmentUrls.push(fileUrl);
          setUploadProgress((p) => ({ ...p, done: p.done + 1 }));
        }
      }

      // Step 2: Submit ticket
      setStatus('submitting');
      await submitTicket.mutateAsync({
        type,
        subject,
        description,
        userEmail: email,
        attachmentUrls,
      });

      setStatus('success');
      setTimeout(onSuccess, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('idle');
    }
  }

  if (status === 'success') {
    return (
      <div className="py-8 text-center">
        <p className="text-lg font-medium text-green-600">Ticket submitted!</p>
        <p className="text-sm text-muted-foreground">We'll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Contact Support</h2>

      {/* Type, Subject, Description, Email, File inputs */}
      {/* ... standard form fields ... */}

      {error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <button
        type="submit"
        disabled={status !== 'idle'}
        className="w-full rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
      >
        {status === 'uploading'
          ? `Uploading ${uploadProgress.done}/${uploadProgress.total}…`
          : status === 'submitting'
          ? 'Submitting…'
          : 'Submit'}
      </button>
    </form>
  );
}
```

### Add Widget to App Layout

In **`shared/ui/components/AppLayout.tsx`**:

```tsx
import { SupportWidget } from '../../../src/support/SupportWidget';

// Inside the render return, after the main content:
<SupportWidget />
```

---

## Summary: Files to Create / Modify

### New Files

| File | Purpose |
|------|---------|
| `apps/api/src/domains/support-domain/types.ts` | Zod schemas for inputs |
| `apps/api/src/domains/support-domain/router.ts` | tRPC router (authedProcedure) |
| `apps/api/src/domains/support-domain/commands/index.ts` | Re-exports |
| `apps/api/src/domains/support-domain/commands/getUploadUrl.ts` | S3 presigned URL generation |
| `apps/api/src/domains/support-domain/commands/submitTicket.ts` | AirTable POST |
| `apps/api/src/domains/support-domain/lib/airtable-client.ts` | AirTable fetch wrapper |
| `src/support/SupportWidget.tsx` | Floating button + modal state |
| `src/support/components/SupportForm.tsx` | Form with 2-step file upload |

### Files to Modify

| File | Change |
|------|--------|
| `apps/api/src/lib/trpc/router.ts` | Add `support: supportRouter` |
| `apps/api/.env` | Add 5 env vars |
| `apps/api/package.json` | Add `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` |
| `shared/ui/components/AppLayout.tsx` | Add `<SupportWidget />` |

---

## Verification Checklist

1. Navigate to any app page → floating `?` button appears bottom-right
2. Click it → modal opens; email is pre-filled from Clerk
3. Fill type / subject / description, attach a screenshot
4. Submit → AirTable "Tickets" table shows the new record with attachment URL
5. S3 bucket shows the uploaded file at `support/{userId}/...`
6. Error path: bad AirTable credentials → user sees red error box, no crash
