import { injectable } from 'tsyringe';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/appError';
import { OrderStatus, PriorityLevel } from '@prisma/client';

@injectable()
export class OrderService {
  async create(userId: string, data: { title: string; description: string; location?: string; priority?: PriorityLevel; clientName?: string; clientPhone?: string; clientEmail?: string; scheduledAt?: Date; }) {
    if (!data.title || !data.description) throw new AppError(400, 'Title and description are required');

    return prisma.order.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        location: data.location,
        priority: data.priority ?? 'NORMAL',
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail,
        scheduledAt: data.scheduledAt,
      },
      include: { checklist: true, photos: true },
    });
  }

  async findAll(userId: string, status?: OrderStatus) {
    const where: any = { userId };
    if (status) where.status = status;

    return prisma.order.findMany({
      where,
      include: { checklist: { orderBy: { order: 'asc' } }, photos: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: {
        checklist: { orderBy: { order: 'asc' } },
        photos: true,
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });
    if (!order) throw new AppError(404, 'Order not found');
    return order;
  }

  async update(id: string, userId: string, data: Partial<{ title: string; description: string; status: OrderStatus; location: string; priority: PriorityLevel; clientName: string; clientPhone: string; clientEmail: string; scheduledAt: Date; completedAt: Date; }>) {
    const exists = await prisma.order.findFirst({ where: { id, userId } });
    if (!exists) throw new AppError(404, 'Order not found');

    return prisma.order.update({
      where: { id },
      data,
      include: { checklist: true, photos: true },
    });
  }

  async delete(id: string, userId: string) {
    const exists = await prisma.order.findFirst({ where: { id, userId } });
    if (!exists) throw new AppError(404, 'Order not found');
    await prisma.order.delete({ where: { id } });
  }

  async updateStatus(id: string, userId: string, status: OrderStatus) {
    const exists = await prisma.order.findFirst({ where: { id, userId } });
    if (!exists) throw new AppError(404, 'Order not found');

    return prisma.order.update({
      where: { id },
      data: { status, completedAt: status === 'COMPLETED' ? new Date() : null },
      include: { checklist: true, photos: true },
    });
  }
}