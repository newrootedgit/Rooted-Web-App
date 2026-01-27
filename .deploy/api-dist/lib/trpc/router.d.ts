export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: {
        req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider.js").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
        res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
        prisma: import("../../generated/prisma/client.js").PrismaClient;
        auth: import("../auth/types.js").AuthContext | undefined;
    };
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    machines: import("@trpc/server").TRPCBuiltRouter<{
        ctx: {
            req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider.js").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
            res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
            prisma: import("../../generated/prisma/client.js").PrismaClient;
            auth: import("../auth/types.js").AuthContext | undefined;
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
            output: import("./pagination/schemas.js").PaginatedResponse<import("../../domains/machine-domain/types.js").Machine>;
            meta: object;
        }>;
        byId: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: import("../../domains/machine-domain/types.js").Machine;
            meta: object;
        }>;
        byDeviceId: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                deviceId: string;
            };
            output: import("../../domains/machine-domain/types.js").Machine | null;
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                farmId?: string | undefined;
                name: string;
                deviceId: string;
                displayName?: string | undefined;
            };
            output: import("../../domains/machine-domain/types.js").Machine;
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
    onboarding: import("@trpc/server").TRPCBuiltRouter<{
        ctx: {
            req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider.js").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
            res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
            prisma: import("../../generated/prisma/client.js").PrismaClient;
            auth: import("../auth/types.js").AuthContext | undefined;
        };
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        status: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../domains/onboarding-domain/types.js").OnboardingStatus;
            meta: object;
        }>;
        createTenantAndFarm: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                farmName: string;
                userEmail: string;
            };
            output: import("../../domains/onboarding-domain/types.js").CreateTenantAndFarmResult;
            meta: object;
        }>;
        farms: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../domains/user-domain/types.js").UserFarm[];
            meta: object;
        }>;
    }>>;
    admin: import("@trpc/server").TRPCBuiltRouter<{
        ctx: {
            req: import("fastify").FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider.js").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
            res: import("fastify").FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
            prisma: import("../../generated/prisma/client.js").PrismaClient;
            auth: import("../auth/types.js").AuthContext | undefined;
        };
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        getAllTenants: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                name: string;
                id: string;
                created_at: Date | null;
                slug: string;
                contact_email: string | null;
                _count: {
                    farms: number;
                    machines: number;
                };
            }[];
            meta: object;
        }>;
        getTenantMachines: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                tenantId: string;
            };
            output: ({
                farms: {
                    name: string;
                    id: string;
                    slug: string;
                } | null;
            } & {
                name: string;
                status: string | null;
                id: string;
                tenant_id: string | null;
                farm_id: string | null;
                created_at: Date | null;
                display_name: string | null;
                device_id: string;
                aws_iot_thing_name: string | null;
                last_seen_at: Date | null;
                current_wifi_ssid: string | null;
            })[];
            meta: object;
        }>;
    }>>;
}>>;
export type AppRouter = typeof appRouter;
//# sourceMappingURL=router.d.ts.map