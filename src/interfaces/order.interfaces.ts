import { OrderStatus, PriorityLevel } from '@prisma/client';

export interface CreateOrderBody {
  title: string;
  description: string;
  priority?: PriorityLevel;
  scheduledAt?: Date;
}

export interface UpdateOrderBody {
  title?: string;
  description?: string;
  status?: OrderStatus;
  priority?: PriorityLevel;
  scheduledAt?: Date;
  completedAt?: Date;
}

export interface OrderResponse {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: OrderStatus;
  priority: PriorityLevel;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  scheduledAt?: Date;
  checklist?: ChecklistResponse[];
  photos?: PhotoResponse[];
}

export interface ChecklistResponse {
  id: string;
  orderId: string;
  title: string;
  completed: boolean;
  required: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PhotoResponse {
  id: string;
  orderId: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  description?: string;
  createdAt: Date;
}