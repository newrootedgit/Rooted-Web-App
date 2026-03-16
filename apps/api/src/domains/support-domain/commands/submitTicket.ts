import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getSupportEnv } from '../../../lib/env.js';
import { createAirtableRecord } from '../lib/airtable-client.js';
import type { SubmitTicketInput } from '../types.js';

export async function submitTicket(userId: string, input: SubmitTicketInput) {
  const env = getSupportEnv();

  // Generate presigned GET URLs for attachments so AirTable can download them
  let attachments: { url: string }[] | undefined;
  if (input.attachmentKeys?.length) {
    const s3 = new S3Client({
      region: env.s3Region,
      credentials: {
        accessKeyId: env.s3AccessKeyId,
        secretAccessKey: env.s3SecretAccessKey,
      },
    });
    attachments = await Promise.all(
      input.attachmentKeys.map(async (key) => {
        const command = new GetObjectCommand({
          Bucket: env.s3Bucket,
          Key: key,
        });
        const url = await getSignedUrl(s3, command, { expiresIn: 600 });
        return { url };
      })
    );
  }

  await createAirtableRecord({
    Subject: input.subject,
    Type: input.type,
    Description: input.description,
    'User ID': userId,
    'User Email': input.userEmail,
    'Submitted At': new Date().toISOString().split('T')[0],
    ...(attachments ? { Attachments: attachments } : {}),
  });

  return { success: true };
}
