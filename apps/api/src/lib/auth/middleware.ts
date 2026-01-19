import fp from 'fastify-plugin';
import { createClerkClient } from '@clerk/fastify';

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

  // Create Clerk client for authentication
  const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  });

  fastify.addHook('preHandler', async (request) => {
    if (isPublicRoute(request.url)) {
      return;
    }

    try {
      // Create a Web API Request object from Fastify request
      const protocol = request.headers['x-forwarded-proto'] || 'http';
      const host = request.headers.host || 'localhost';
      const url = `${protocol}://${host}${request.url}`;

      const headers = new Headers();
      for (const [key, value] of Object.entries(request.headers)) {
        if (value) {
          headers.set(key, Array.isArray(value) ? value.join(', ') : value);
        }
      }

      const webRequest = new Request(url, {
        method: request.method,
        headers,
      });

      // Use Clerk's authenticateRequest - handles all token verification
      const requestState = await clerk.authenticateRequest(webRequest, {
        // Allow some clock skew between servers
        clockSkewInMs: 300000, // 5 minutes
      });

      if (!requestState.isSignedIn) {
        // Debug: log full request state info
        const debugInfo = clerk.debugRequestState(requestState);
        logger.warn('User not signed in', {
          status: requestState.status,
          reason: requestState.reason,
          debug: debugInfo,
          authHeader: request.headers.authorization ? 'present' : 'missing',
        });
        throw new UnauthorizedError('Not authenticated');
      }

      const authObject = requestState.toAuth() as { userId?: string; subject?: string };
      // Handle different auth object types (session token vs API key vs M2M)
      const userId = authObject.userId || authObject.subject;

      if (!userId) {
        throw new UnauthorizedError('No user ID in auth token');
      }

      logger.debug('Clerk auth verified', { userId });

      // Optional: Get farm context from header if provided
      const farmId = request.headers['x-farm-id'] as string | undefined;

      if (farmId) {
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
      } else {
        // Basic auth without farm context
        request.auth = {
          userId,
          tenantId: '',
          farmId: '',
          role: 'FARM_OPERATOR' as UserRole,
        };
        logger.debug('Basic auth set (no farm)', { userId });
      }
    } catch (err) {
      if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
        throw err;
      }
      logger.error('Authentication failed', { error: err });
      throw new UnauthorizedError('Authentication failed');
    }
  });
};

export const farmAuthMiddleware = fp(farmAuthPlugin, { name: 'farm-auth-middleware' });
