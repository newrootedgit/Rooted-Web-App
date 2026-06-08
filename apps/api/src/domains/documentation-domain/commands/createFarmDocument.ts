import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { CreateFarmDocumentInput } from '../types.js';

/**
 * Persist metadata for a documentation file that was uploaded to S3.
 * tenant_id is derived from the target farm.
 */
export async function createFarmDocument(
  prisma: PrismaClient,
  uploadedBy: string,
  input: CreateFarmDocumentInput
) {
  const farm = await prisma.farms.findUnique({
    where: { id: input.farmId },
    select: { id: true, tenant_id: true },
  });

  if (!farm) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Farm not found' });
  }

  return prisma.farm_documents.create({
    data: {
      farm_id: input.farmId,
      tenant_id: farm.tenant_id,
      title: input.title,
      category: input.category ?? null,
      description: input.description ?? null,
      s3_key: input.s3Key,
      file_name: input.fileName,
      content_type: input.contentType ?? null,
      file_size: input.fileSize ?? null,
      uploaded_by: uploadedBy,
    },
  });
}
