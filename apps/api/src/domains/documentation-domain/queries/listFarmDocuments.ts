import type { PrismaClient } from '../../../generated/prisma/client.js';

/**
 * List documentation files for a farm (metadata only, no presigned URLs).
 * Ordered by category, then most-recent first.
 */
export async function listFarmDocuments(prisma: PrismaClient, farmId: string) {
  const docs = await prisma.farm_documents.findMany({
    where: { farm_id: farmId },
    orderBy: [{ category: 'asc' }, { created_at: 'desc' }],
  });

  return docs.map((d) => ({
    id: d.id,
    farmId: d.farm_id,
    title: d.title,
    category: d.category,
    description: d.description,
    fileName: d.file_name,
    contentType: d.content_type,
    fileSize: d.file_size,
    createdAt: d.created_at,
  }));
}
