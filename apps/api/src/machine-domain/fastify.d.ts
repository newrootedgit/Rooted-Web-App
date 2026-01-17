import 'fastify';
import type { Machine } from './types.js';

declare module 'fastify' {
  interface FastifyRequest {
    addMachineMiddleware: {
      machine: Machine;
      isNew: boolean;
    } | null;
    getMachineMiddleware: Machine | null;
    getMachineCollectionMiddleware: Machine[] | null;
  }
}
