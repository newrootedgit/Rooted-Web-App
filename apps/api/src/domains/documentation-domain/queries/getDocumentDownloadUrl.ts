import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../generated/prisma/client.js';
import { getDocsS3 } from '../lib/s3.js';

/**
 * Generate a short-lived presigned GET URL for a document, after verifying it
 * belongs to the requesting farm (prevents cross-farm access).
 */
export async function getDocumentDownloadUrl(prisma: PrismaClient, farmId: string, id: string) {
  const doc = await prisma.farm_documents.findUnique({
    where: { id },
    select: { id: true, farm_id: true, s3_key: true, file_name: true },
  });

  if (!doc || doc.farm_id !== farmId) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Document not found' });
  }

  const { s3, bucket } = getDocsS3();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: doc.s3_key,
    ResponseContentDisposition: `attachment; filename="${doc.file_name}"`,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 600 });

  return { url };
}
