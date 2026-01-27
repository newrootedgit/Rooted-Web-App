export declare const machineRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: {
        req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider.js").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
        res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
        prisma: import("../../generated/prisma/client.js").PrismaClient;
        auth: import("../../lib/auth/types.js").AuthContext | undefined;
    };
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            farmId?: string | undefined;
            cursor?: string | undefined;
            limit?: number | undefined;
        };
        output: import("../../lib/trpc/pagination/schemas.js").PaginatedResponse<import("./types.js").Machine>;
        meta: object;
    }>;
    byId: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: import("./types.js").Machine;
        meta: object;
    }>;
    byDeviceId: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            deviceId: string;
        };
        output: import("./types.js").Machine | null;
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            farmId?: string | undefined;
            name: string;
            deviceId: string;
            displayName?: string | undefined;
        };
        output: import("./types.js").Machine;
        meta: object;
    }>;
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            farmId?: string | undefined;
            deviceId: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=router.d.ts.map