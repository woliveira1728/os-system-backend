import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';
import { PhotoService } from '../services';
import { AppError } from '../errors/appError';

@injectable()
export class PhotoController {
  constructor(
    @inject('PhotoService')
    private photoService: PhotoService
  ) {}

  async upload(request: FastifyRequest, reply: FastifyReply): Promise<any> {
    try {
      const userId = (request as any).user.id;
      const { orderId } = request.params as { orderId: string };
      const file = await request.file();
      const description = request.body as any;

      const photo = await this.photoService.upload(
        orderId,
        userId,
        file!,
        description?.description
      );
      return reply.code(201).send(photo);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ message: error.message });
      }
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  async findByOrderId(request: FastifyRequest, reply: FastifyReply): Promise<any> {
    try {
      const userId = (request as any).user.id;
      const { orderId } = request.params as { orderId: string };

      const photos = await this.photoService.findByOrderId(orderId, userId);
      return reply.code(200).send(photos);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ message: error.message });
      }
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply): Promise<any> {
    try {
      const userId = (request as any).user.id;
      const { id } = request.params as { id: string };

      await this.photoService.delete(id, userId);
      return reply.code(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ message: error.message });
      }
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }
}