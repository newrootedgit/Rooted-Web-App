import { S3Client } from '@aws-sdk/client-s3';
import { getSupportEnv } from '../../../lib/env.js';

/**
 * Build an S3 client + bucket for farm documentation.
 * Reuses the existing support S3 bucket/credentials (docs live under a
 * `farm-docs/{farmId}/` key prefix), so no new infra is required.
 */
export function getDocsS3() {
  const env = getSupportEnv();
  const s3 = new S3Client({
    region: env.s3Region,
    credentials: {
      accessKeyId: env.s3AccessKeyId,
      secretAccessKey: env.s3SecretAccessKey,
    },
    requestChecksumCalculation: 'WHEN_REQUIRED',
  });
  return { s3, bucket: env.s3Bucket };
}
