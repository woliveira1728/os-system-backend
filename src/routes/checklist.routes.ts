import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { ChecklistController } from '../controllers';
import { ChecklistService } from '../services';
import { authGuard } from '../middlewares/authGuard';

container.registerSingleton('ChecklistService', ChecklistService);
const checklistController = container.resolve(ChecklistController);

export const checklistRouter = async (fastify: FastifyInstance) => {
  fastify.addHook('preHandler', authGuard);

  fastify.post('/orders/:orderId/checklist', async (request, reply) => {
    return checklistController.create(request, reply);
  });

  fastify.get('/orders/:orderId/checklist', async (request, reply) => {
    return checklistController.findByOrderId(request, reply);
  });

  fastify.put('/:id', async (request, reply) => {
    return checklistController.update(request, reply);
  });

  fastify.delete('/:id', async (request, reply) => {
    return checklistController.delete(request, reply);
  });

  fastify.patch('/:id/toggle', async (request, reply) => {
    return checklistController.toggleComplete(request, reply);
  });
};