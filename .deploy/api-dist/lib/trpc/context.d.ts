import type { FastifyRequest, FastifyReply } from 'fastify';
import type { inferAsyncReturnType } from '@trpc/server';
import '../auth/types.js';
export declare function createContext({ req, res, }: {
    req: FastifyRequest;
    res: FastifyReply;
}): Promise<{
    req: FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider.js").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    res: FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    prisma: import("../../generated/prisma/client.js").PrismaClient;
    auth: import("../auth/types.js").AuthContext | undefined;
}>;
export type Context = inferAsyncReturnType<typeof createContext>;
//# sourceMappingURL=context.d.ts.map