import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';
import { OrderService } from '../services';
import { AppError } from '../errors/appError';
import { CreateOrderBody, UpdateOrderBody } from '../interfaces';
import { OrderStatus } from '@prisma/client';

@injectable()
export class OrderController {
  constructor(
    @inject('OrderService')
    private orderService: OrderService
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply): Promise<any> {
    try {
      const userId = (request as any).user.id;
      const data: CreateOrderBody = request.body as CreateOrderBody;

      const order = await this.orderService.create(userId, data);
      return reply.code(201).send(order);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ message: error.message });
      }
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  async findAll(request: FastifyRequest, reply: FastifyReply): Promise<any> {
    try {
      const userId = (request as any).user.id;
      const { status } = request.query as { status?: OrderStatus };

      const orders = await this.orderService.findAll(userId, status);
      return reply.code(200).send(orders);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ message: error.message });
      }
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply): Promise<any> {
    try {
      const userId = (request as any).user.id;
      const { id } = request.params as { id: string };

      const order = await this.orderService.findById(id, userId);
      return reply.code(200).send(order);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ message: error.message });
      }
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply): Promise<any> {
    try {
      const userId = (request as any).user.id;
      const { id } = request.params as { id: string };
      const data: UpdateOrderBody = request.body as UpdateOrderBody;

      const order = await this.orderService.update(id, userId, data);
      return reply.code(200).send(order);
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

      await this.orderService.delete(id, userId);
      return reply.code(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ message: error.message });
      }
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  async updateStatus(request: FastifyRequest, reply: FastifyReply): Promise<any> {
    try {
      const userId = (request as any).user.id;
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: OrderStatus };

      const order = await this.orderService.updateStatus(id, userId, status);
      return reply.code(200).send(order);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ message: error.message });
      }
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }
}