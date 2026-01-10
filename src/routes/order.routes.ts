import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { OrderController } from '../controllers';
import { OrderService } from '../services';
import { authGuard } from '../middlewares/authGuard';

container.registerSingleton('OrderService', OrderService);
const orderController = container.resolve(OrderController);

export const orderRouter = async (fastify: FastifyInstance) => {
  fastify.addHook('preHandler', authGuard);

  fastify.post('/', async (request, reply) => {
    return orderController.create(request, reply);
  });

  fastify.get('/', async (request, reply) => {
    return orderController.findAll(request, reply);
  });

  fastify.get('/:id', async (request, reply) => {
    return orderController.findById(request, reply);
  });

  fastify.put('/:id', async (request, reply) => {
    return orderController.update(request, reply);
  });

  fastify.delete('/:id', async (request, reply) => {
    return orderController.delete(request, reply);
  });

  fastify.patch('/:id/status', async (request, reply) => {
    return orderController.updateStatus(request, reply);
  });
};