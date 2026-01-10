import { OrderStatus, PriorityLevel } from '@prisma/client';

export interface CreateOrderBody {
  title: string;
  description: string;
  location?: string;
  priority?: PriorityLevel;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  scheduledAt?: Date;
}

export interface UpdateOrderBody {
  title?: string;
  description?: string;
  status?: OrderStatus;
  location?: string;
  priority?: PriorityLevel;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  scheduledAt?: Date;
  completedAt?: Date;
}

export interface OrderResponse {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: OrderStatus;
  location?: string;
  priority: PriorityLevel;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
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
  notes?: string;
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
  thumbnailUrl?: string;
  description?: string;
  createdAt: Date;
}