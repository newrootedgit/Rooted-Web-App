import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../generated/prisma/client.js';
import { getDocsS3 } from '../lib/s3.js';

/**
 * Remove a documentation file: delete the underlying S3 object, then the row.
 */
export async function deleteFarmDocument(prisma: PrismaClient, id: string) {
  const doc = await prisma.farm_documents.findUnique({
    where: { id },
    select: { id: true, s3_key: true },
  });

  if (!doc) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Document not found' });
  }

  const { s3, bucket } = getDocsS3();
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: doc.s3_key }));

  await prisma.farm_documents.delete({ where: { id } });

  return { success: true };
}
