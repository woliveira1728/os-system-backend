import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';
import { ChecklistService } from '../services';
import { AppError } from '../errors/appError';
import { CreateChecklistBody, UpdateChecklistBody } from '../interfaces';

@injectable()
export class ChecklistController {
  constructor(
    @inject('ChecklistService')
    private checklistService: ChecklistService
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply): Promise<any> {
    try {
      const userId = (request as any).user.id;
      const { orderId } = request.params as { orderId: string };
      const data: CreateChecklistBody = request.body as CreateChecklistBody;

      const checklist = await this.checklistService.create(orderId, userId, data);

      return reply.code(201).send(checklist);
    } catch (error) {
      console.error('❌ CREATE - Erro:', error);
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

      const checklists = await this.checklistService.findByOrderId(orderId, userId);
      
      console.log('📋 FIND - Checklists encontrados:', checklists);

      return reply.code(200).send(checklists);
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
      const data: UpdateChecklistBody = request.body as UpdateChecklistBody;

      console.log('🔄 UPDATE - Dados recebidos:', { id, userId, data });

      const checklist = await this.checklistService.update(id, userId, data);
      
      console.log('✅ UPDATE - Checklist atualizado:', checklist);

      return reply.code(200).send(checklist);
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

      console.log('🗑️  DELETE - ID:', id);

      await this.checklistService.delete(id, userId);
      return reply.code(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ message: error.message });
      }
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  async toggleComplete(request: FastifyRequest, reply: FastifyReply): Promise<any> {
    try {
      const userId = (request as any).user.id;
      const { id } = request.params as { id: string };

      console.log('🔀 TOGGLE - ID:', id);

      const checklist = await this.checklistService.toggleComplete(id, userId);
      
      console.log('✅ TOGGLE - Checklist após toggle:', checklist);

      return reply.code(200).send(checklist);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ message: error.message });
      }
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }
}