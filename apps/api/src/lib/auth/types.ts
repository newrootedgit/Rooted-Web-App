export type UserRole = 'OWNER' | 'ADMIN' | 'FARM_MANAGER' | 'FARM_OPERATOR';

export interface AuthContext {
  userId: string;
  tenantId: string;
  farmId: string;
  role: UserRole;
}

export interface AuthMiddlewareOptions {
  logger: import('winston').Logger;
}

declare module 'fastify' {
  interface FastifyRequest {
    auth?: AuthContext;
  }
}
