import { vi, type Mock } from 'vitest';

export const mockTimescaleClient: { query: Mock; release: Mock } = {
  query: vi.fn(),
  release: vi.fn(),
};

export const mockTimescale: { connect: Mock; query: Mock; end: Mock } = {
  connect: vi.fn().mockResolvedValue(mockTimescaleClient),
  query: vi.fn(),
  end: vi.fn(),
};
