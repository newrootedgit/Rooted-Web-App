import { describe, it, expect, beforeEach } from 'vitest';
import { createFarmDocument } from '../createFarmDocument.js';
import {
  createMockPrisma,
  createMockDbFarm,
  createMockDbFarmDocument,
  type MockPrismaClient,
} from '../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

describe('createFarmDocument', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  const input = {
    farmId: 'farm-uuid-1',
    title: 'Harvester Manual',
    category: 'Manuals',
    description: 'How to operate the harvester',
    s3Key: 'farm-docs/farm-uuid-1/abc-manual.pdf',
    fileName: 'manual.pdf',
    contentType: 'application/pdf',
    fileSize: 2048,
  };

  it('creates a document row with tenant_id derived from the farm', async () => {
    mockPrisma.farms.findUnique.mockResolvedValue(
      createMockDbFarm({ id: 'farm-uuid-1', tenant_id: 'tenant-uuid-9' })
    );
    mockPrisma.farm_documents.create.mockResolvedValue(createMockDbFarmDocument());

    await createFarmDocument(mockPrisma as unknown as PrismaClient, 'admin-1', input);

    expect(mockPrisma.farm_documents.create).toHaveBeenCalledWith({
      data: {
        farm_id: 'farm-uuid-1',
        tenant_id: 'tenant-uuid-9',
        title: 'Harvester Manual',
        category: 'Manuals',
        description: 'How to operate the harvester',
        s3_key: 'farm-docs/farm-uuid-1/abc-manual.pdf',
        file_name: 'manual.pdf',
        content_type: 'application/pdf',
        file_size: 2048,
        uploaded_by: 'admin-1',
      },
    });
  });

  it('throws NOT_FOUND when the farm does not exist', async () => {
    mockPrisma.farms.findUnique.mockResolvedValue(null);

    await expect(
      createFarmDocument(mockPrisma as unknown as PrismaClient, 'admin-1', input)
    ).rejects.toThrow('Farm not found');
    expect(mockPrisma.farm_documents.create).not.toHaveBeenCalled();
  });

  it('defaults optional fields to null', async () => {
    mockPrisma.farms.findUnique.mockResolvedValue(
      createMockDbFarm({ id: 'farm-uuid-1', tenant_id: 'tenant-uuid-9' })
    );
    mockPrisma.farm_documents.create.mockResolvedValue(createMockDbFarmDocument());

    await createFarmDocument(mockPrisma as unknown as PrismaClient, 'admin-1', {
      farmId: 'farm-uuid-1',
      title: 'Bare doc',
      s3Key: 'farm-docs/farm-uuid-1/x.pdf',
      fileName: 'x.pdf',
    });

    expect(mockPrisma.farm_documents.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        category: null,
        description: null,
        content_type: null,
        file_size: null,
      }),
    });
  });
});
