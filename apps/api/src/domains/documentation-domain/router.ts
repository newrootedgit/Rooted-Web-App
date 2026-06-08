import { router, adminProcedure, farmProcedure } from '../../lib/trpc/trpc.js';
import {
  getDocumentUploadUrlInput,
  createFarmDocumentInput,
  listFarmDocumentsInput,
  documentIdInput,
} from './types.js';
import { getDocumentUploadUrl } from './commands/getDocumentUploadUrl.js';
import { createFarmDocument } from './commands/createFarmDocument.js';
import { deleteFarmDocument } from './commands/deleteFarmDocument.js';
import { listFarmDocuments } from './queries/listFarmDocuments.js';
import { getDocumentDownloadUrl } from './queries/getDocumentDownloadUrl.js';

export const documentationRouter = router({
  // --- Admin: manage docs for an explicitly chosen farm ---
  getUploadUrl: adminProcedure
    .input(getDocumentUploadUrlInput)
    .mutation(({ input }) => getDocumentUploadUrl(input)),

  create: adminProcedure
    .input(createFarmDocumentInput)
    .mutation(({ ctx, input }) => createFarmDocument(ctx.prisma, ctx.userId, input)),

  delete: adminProcedure
    .input(documentIdInput)
    .mutation(({ ctx, input }) => deleteFarmDocument(ctx.prisma, input.id)),

  listForFarm: adminProcedure
    .input(listFarmDocumentsInput)
    .query(({ ctx, input }) => listFarmDocuments(ctx.prisma, input.farmId)),

  // --- Farm user: read docs for their own farm (scoped via ctx.farmId) ---
  list: farmProcedure.query(({ ctx }) => listFarmDocuments(ctx.prisma, ctx.farmId)),

  getDownloadUrl: farmProcedure
    .input(documentIdInput)
    .query(({ ctx, input }) => getDocumentDownloadUrl(ctx.prisma, ctx.farmId, input.id)),
});
