import { useState, useRef } from 'react';
import { Paperclip, XCircle } from 'lucide-react';
import { trpc } from '../../lib/trpc';

const TICKET_TYPES = ['Bug', 'Feature Request', 'Question'] as const;

interface SupportFormProps {
  userEmail: string;
  onSuccess: () => void;
}

export function SupportForm({ userEmail, onSuccess }: SupportFormProps) {
  const [type, setType] = useState<(typeof TICKET_TYPES)[number]>('Question');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState(userEmail);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'submitting' | 'success'>('idle');
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUploadUrl = trpc.support.getUploadUrl.useMutation();
  const submitTicket = trpc.support.submitTicket.useMutation();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      // Step 1: Upload files via presigned URLs
      const attachmentKeys: string[] = [];
      if (files.length > 0) {
        setStatus('uploading');
        setUploadProgress({ done: 0, total: files.length });

        for (const file of files) {
          const { uploadUrl, s3Key } = await getUploadUrl.mutateAsync({
            filename: file.name,
            contentType: file.type,
          });

          const uploadRes = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
          });

          if (!uploadRes.ok) {
            throw new Error(`Failed to upload ${file.name}`);
          }

          attachmentKeys.push(s3Key);
          setUploadProgress((p) => ({ ...p, done: p.done + 1 }));
        }
      }

      // Step 2: Submit ticket with S3 keys
      setStatus('submitting');
      await submitTicket.mutateAsync({
        type,
        subject,
        description,
        userEmail: email,
        attachmentKeys: attachmentKeys.length > 0 ? attachmentKeys : undefined,
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
        <p className="text-lg font-medium text-primary">Ticket submitted!</p>
        <p className="text-sm text-muted-foreground mt-1">We'll get back to you soon.</p>
      </div>
    );
  }

  const isSubmitting = status !== 'idle';
  const inputClass = 'px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-foreground">Contact Support</h2>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as (typeof TICKET_TYPES)[number])}
          className={inputClass}
        >
          {TICKET_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">Subject *</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={inputClass}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={`${inputClass} resize-none`}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">Attachments</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={files.length >= 5}
            className="flex items-center gap-1 px-3 py-2 bg-secondary border border-border rounded-md text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors disabled:opacity-50"
          >
            <Paperclip size={16} />
            <span className="text-sm">Add file</span>
          </button>
          <span className="text-xs text-muted-foreground">{files.length}/5 files</span>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="image/*,application/pdf,.txt"
            className="hidden"
          />
        </div>
        {files.length > 0 && (
          <div className="flex flex-col gap-1 mt-1">
            {files.map((file, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                <span className="truncate flex-1">{file.name}</span>
                <button type="button" onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive">
                  <XCircle size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {status === 'uploading'
            ? `Uploading ${uploadProgress.done}/${uploadProgress.total}...`
            : status === 'submitting'
            ? 'Submitting...'
            : 'Submit'}
        </button>
      </div>
    </form>
  );
}
