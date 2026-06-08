import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { getDocsS3 } from '../lib/s3.js';
import type { GetDocumentUploadUrlInput } from '../types.js';

/**
 * Generate a presigned PUT URL so the admin can upload a documentation file
 * directly to S3 under the target farm's prefix.
 */
export async function getDocumentUploadUrl(input: GetDocumentUploadUrlInput) {
  const { s3, bucket } = getDocsS3();
  const key = `farm-docs/${input.farmId}/${randomUUID()}-${input.filename}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: input.contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  return { uploadUrl, s3Key: key };
}
