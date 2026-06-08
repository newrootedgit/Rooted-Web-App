import { describe, it, expect, beforeEach, vi } from 'vitest';

const sendMock = vi.fn();
vi.mock('../../lib/s3.js', () => ({
  getDocsS3: () => ({ s3: { send: sendMock }, bucket: 'test-bucket' }),
}));

import { deleteFarmDocument } from '../deleteFarmDocument.js';
import {
  createMockPrisma,
  createMockDbFarmDocument,
  type MockPrismaClient,
} from '../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

describe('deleteFarmDocument', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    sendMock.mockReset();
  });

  it('deletes the S3 object then the row', async () => {
    mockPrisma.farm_documents.findUnique.mockResolvedValue(
      createMockDbFarmDocument({ id: 'doc-1', s3_key: 'farm-docs/farm-uuid-1/abc.pdf' })
    );

    const result = await deleteFarmDocument(mockPrisma as unknown as PrismaClient, 'doc-1');

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(mockPrisma.farm_documents.delete).toHaveBeenCalledWith({ where: { id: 'doc-1' } });
    expect(result).toEqual({ success: true });
  });

  it('throws NOT_FOUND and skips S3 when the document is missing', async () => {
    mockPrisma.farm_documents.findUnique.mockResolvedValue(null);

    await expect(
      deleteFarmDocument(mockPrisma as unknown as PrismaClient, 'doc-1')
    ).rejects.toThrow('Document not found');
    expect(sendMock).not.toHaveBeenCalled();
    expect(mockPrisma.farm_documents.delete).not.toHaveBeenCalled();
  });
});
