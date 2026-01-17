import type { FastifyInstance } from 'fastify';
import { addMachineMiddleware } from './middlewares/add-machine.middleware.js';
import { getMachineMiddleware } from './middlewares/get-machine.middleware.js';
import { getMachineCollectionMiddleware } from './middlewares/get-machine-collection.middleware.js';
import { addMachineRoute } from './routes/add-machine-route.js';
import { getMachineRoute } from './routes/get-machine.route.js';
import { getMachineCollectionRoute } from './routes/get-machine-collection.route.js';

export async function onboardingRouter(app: FastifyInstance) {
  app.decorateRequest('addMachineMiddleware', null);
  app.decorateRequest('getMachineMiddleware', null);
  app.decorateRequest('getMachineCollectionMiddleware', null);

  app.post('/machines', {
    preHandler: addMachineMiddleware,
    handler: addMachineRoute,
  });

  app.get('/machines/:id', {
    preHandler: getMachineMiddleware,
    handler: getMachineRoute,
  });

  app.get('/machines', {
    preHandler: getMachineCollectionMiddleware,
    handler: getMachineCollectionRoute,
  });
}
