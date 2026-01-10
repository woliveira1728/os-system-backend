import { injectable } from 'tsyringe';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/appError';

@injectable()
export class ChecklistService {
  async create(orderId: string, userId: string, data: { title: string; required?: boolean; order?: number }) {
    const order = await prisma.order.findFirst({ where: { id: orderId, userId } });
    if (!order) throw new AppError(404, 'Order not found');
    if (!data.title) throw new AppError(400, 'Title is required');

    // calcula próximo índice
    const agg = await prisma.checklist.aggregate({
      where: { orderId },
      _max: { order: true },
    });
    const nextOrder = (agg._max.order ?? -1) + 1;

    return prisma.checklist.create({
      data: {
        orderId,
        title: data.title,
        required: data.required ?? true,
        order: data.order ?? nextOrder,
        completed: false,
      },
    });
  }

  async findByOrderId(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({ where: { id: orderId, userId } });
    if (!order) throw new AppError(404, 'Order not found');

    return prisma.checklist.findMany({
      where: { orderId },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }], // ordenação estável
    });
  }

  async update(checklistId: string, userId: string, data: { title?: string; completed?: boolean; notes?: string; required?: boolean; order?: number }) {
    const checklist = await prisma.checklist.findUnique({
      where: { id: checklistId },
      include: { orderRef: true },
    });
    if (!checklist || checklist.orderRef.userId !== userId) throw new AppError(404, 'Checklist not found');

    return prisma.checklist.update({
      where: { id: checklistId },
      data: {
        title: data.title,
        completed: data.completed,
        notes: data.notes,
        required: data.required,
        order: data.order,
      },
    });
  }

  async delete(checklistId: string, userId: string) {
    const checklist = await prisma.checklist.findUnique({
      where: { id: checklistId },
      include: { orderRef: true },
    });
    if (!checklist || checklist.orderRef.userId !== userId) throw new AppError(404, 'Checklist not found');

    await prisma.checklist.delete({ where: { id: checklistId } });
  }

  async toggleComplete(checklistId: string, userId: string) {
    const checklist = await prisma.checklist.findUnique({
      where: { id: checklistId },
      include: { orderRef: true },
    });
    if (!checklist || checklist.orderRef.userId !== userId) throw new AppError(404, 'Checklist not found');

    return prisma.checklist.update({
      where: { id: checklistId },
      data: { completed: !checklist.completed },
    });
  }
}