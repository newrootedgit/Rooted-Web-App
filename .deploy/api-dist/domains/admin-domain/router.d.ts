export declare const adminRouter: import("@trpc/server").TRPCBuiltRouter<{
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
//# sourceMappingURL=router.d.ts.map