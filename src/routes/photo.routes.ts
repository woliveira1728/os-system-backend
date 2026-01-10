import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { PhotoController } from '../controllers';
import { PhotoService } from '../services';
import { authGuard } from '../middlewares/authGuard';

container.registerSingleton('PhotoService', PhotoService);
const photoController = container.resolve(PhotoController);

export const photoRouter = async (fastify: FastifyInstance) => {
  fastify.addHook('preHandler', authGuard);

  fastify.post('/:orderId', async (request, reply) => {
    return photoController.upload(request, reply);
  });

  fastify.get('/:orderId', async (request, reply) => {
    return photoController.findByOrderId(request, reply);
  });

  fastify.delete('/:id', async (request, reply) => {
    return photoController.delete(request, reply);
  });
};