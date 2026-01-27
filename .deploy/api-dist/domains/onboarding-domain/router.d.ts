export declare const onboardingRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    status: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("./types.js").OnboardingStatus;
        meta: object;
    }>;
    createTenantAndFarm: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            farmName: string;
            userEmail: string;
        };
        output: import("./types.js").CreateTenantAndFarmResult;
        meta: object;
    }>;
    farms: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("../user-domain/types.js").UserFarm[];
        meta: object;
    }>;
}>>;
//# sourceMappingURL=router.d.ts.map