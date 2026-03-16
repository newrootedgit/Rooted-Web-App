import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { getSupportEnv } from '../../../lib/env.js';
import type { GetUploadUrlInput } from '../types.js';

export async function getUploadUrl(userId: string, input: GetUploadUrlInput) {
  const env = getSupportEnv();
  const s3 = new S3Client({
    region: env.s3Region,
    credentials: {
      accessKeyId: env.s3AccessKeyId,
      secretAccessKey: env.s3SecretAccessKey,
    },
    requestChecksumCalculation: 'WHEN_REQUIRED',
  });
  const key = `support/${userId}/${randomUUID()}-${input.filename}`;

  const command = new PutObjectCommand({
    Bucket: env.s3Bucket,
    Key: key,
    ContentType: input.contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  return { uploadUrl, s3Key: key };
}
