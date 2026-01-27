export type UserRole = 'OWNER' | 'ADMIN' | 'FARM_MANAGER' | 'FARM_OPERATOR';
export interface AuthContext {
    userId: string;
    tenantId: string;
    farmId: string;
    role: UserRole;
}
export interface AuthMiddlewareOptions {
    logger: import('../logger/types.js').Logger;
}
declare module 'fastify' {
    interface FastifyRequest {
        auth?: AuthContext;
    }
}
//# sourceMappingURL=types.d.ts.map