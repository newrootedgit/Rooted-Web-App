import { z } from 'zod';

export const getDocumentUploadUrlInput = z.object({
  farmId: z.string().uuid(),
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1),
});

export const createFarmDocumentInput = z.object({
  farmId: z.string().uuid(),
  title: z.string().min(1).max(255),
  category: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
  s3Key: z.string().min(1).max(1024),
  fileName: z.string().min(1).max(512),
  contentType: z.string().max(255).optional(),
  fileSize: z.number().int().nonnegative().optional(),
});

export const listFarmDocumentsInput = z.object({
  farmId: z.string().uuid(),
});

export const documentIdInput = z.object({
  id: z.string().uuid(),
});

export type GetDocumentUploadUrlInput = z.infer<typeof getDocumentUploadUrlInput>;
export type CreateFarmDocumentInput = z.infer<typeof createFarmDocumentInput>;
export type ListFarmDocumentsInput = z.infer<typeof listFarmDocumentsInput>;
export type DocumentIdInput = z.infer<typeof documentIdInput>;
