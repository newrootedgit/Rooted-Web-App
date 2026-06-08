import { describe, it, expect, beforeEach } from 'vitest';
import { listFarmDocuments } from '../listFarmDocuments.js';
import {
  createMockPrisma,
  createMockDbFarmDocument,
  type MockPrismaClient,
} from '../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

describe('listFarmDocuments', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('maps db rows to camelCase and queries by farm', async () => {
    mockPrisma.farm_documents.findMany.mockResolvedValue([
      createMockDbFarmDocument({ id: 'doc-1', title: 'Manual', file_name: 'manual.pdf' }),
    ]);

    const result = await listFarmDocuments(mockPrisma as unknown as PrismaClient, 'farm-uuid-1');

    expect(result).toEqual([
      expect.objectContaining({
        id: 'doc-1',
        farmId: 'farm-uuid-1',
        title: 'Manual',
        category: 'Manuals',
        fileName: 'manual.pdf',
        contentType: 'application/pdf',
        fileSize: 1024,
      }),
    ]);
    expect(mockPrisma.farm_documents.findMany).toHaveBeenCalledWith({
      where: { farm_id: 'farm-uuid-1' },
      orderBy: [{ category: 'asc' }, { created_at: 'desc' }],
    });
  });

  it('returns an empty array when there are no documents', async () => {
    mockPrisma.farm_documents.findMany.mockResolvedValue([]);

    const result = await listFarmDocuments(mockPrisma as unknown as PrismaClient, 'farm-uuid-1');

    expect(result).toEqual([]);
  });
});
