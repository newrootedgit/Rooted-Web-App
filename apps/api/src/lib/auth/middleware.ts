import fp from 'fastify-plugin';
import { getAuth } from '@clerk/fastify';

import { prisma } from '../db/index.js';
import { UnauthorizedError, ForbiddenError } from '../errors/index.js';

import type { FastifyPluginAsync } from 'fastify';
import type { AuthContext, AuthMiddlewareOptions, UserRole } from './types.js';

const PUBLIC_ROUTES = ['/health'];

const isPublicRoute = (url: string): boolean => {
  return PUBLIC_ROUTES.some((route) => url.startsWith(route));
};

const farmAuthPlugin: FastifyPluginAsync<AuthMiddlewareOptions> = async (fastify, options) => {
  const { logger } = options;

  fastify.addHook('preHandler', async (request) => {
    if (isPublicRoute(request.url)) {
      return;
    }

    const { userId } = getAuth(request);
    if (!userId) {
      throw new UnauthorizedError('Not authenticated');
    }

    const farmId = request.headers['x-farm-id'] as string;
    if (!farmId) {
      throw new UnauthorizedError('Missing X-Farm-Id header');
    }

    const farmUser = await prisma.farm_users.findFirst({
      where: {
        clerk_user_id: userId,
        farm_id: farmId,
        is_active: true,
      },
      include: { farms: true },
    });

    if (!farmUser || !farmUser.farms) {
      throw new ForbiddenError('No access to this farm');
    }

    const authContext: AuthContext = {
      userId,
      tenantId: farmUser.farms.tenant_id!,
      farmId,
      role: farmUser.role as UserRole,
    };

    request.auth = authContext;

    logger.debug('Auth context set', {
      userId,
      farmId,
      tenantId: authContext.tenantId,
      role: authContext.role,
    });
  });
};

export const farmAuthMiddleware = fp(farmAuthPlugin, { name: 'farm-auth-middleware' });
