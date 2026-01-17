import type { FastifyInstance } from 'fastify';
import { onboardingRouter } from './onboarding/onboarding.router.js';

export async function machineRouter(app: FastifyInstance) {
  await app.register(onboardingRouter, { prefix: '/api/machines' });
}
