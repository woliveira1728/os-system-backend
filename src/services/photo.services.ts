import { injectable } from 'tsyringe';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/appError';
import { MultipartFile } from '@fastify/multipart';
import { randomUUID } from 'crypto';
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';

@injectable()
export class PhotoService {
  private uploadsDir = join(process.cwd(), 'uploads', 'photos');

  constructor() {
    if (!existsSync(this.uploadsDir)) mkdirSync(this.uploadsDir, { recursive: true });
  }

  async upload(orderId: string, userId: string, file: MultipartFile, description?: string) {
    const order = await prisma.order.findFirst({ where: { id: orderId, userId } });
    if (!order) throw new AppError(404, 'Order not found');

    if (!file) throw new AppError(400, 'File is required');

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) throw new AppError(400, 'Only JPEG/PNG/WEBP images are allowed');

    const filename = `${randomUUID()}-${file.filename}`;
    const filepath = join(this.uploadsDir, filename);

    await new Promise<void>((resolve, reject) => {
      const ws = createWriteStream(filepath);
      file.file.pipe(ws);
      ws.on('finish', resolve);
      ws.on('error', reject);
    });

    // size via buffer
    const size = (await file.toBuffer()).length;
    const url = `/uploads/photos/${filename}`;

    return prisma.photo.create({
      data: {
        orderId,
        filename,
        url,
        size,
        mimeType: file.mimetype,
        description,
      },
    });
  }

  async findByOrderId(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({ where: { id: orderId, userId } });
    if (!order) throw new AppError(404, 'Order not found');

    return prisma.photo.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(photoId: string, userId: string) {
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { order: true },
    });
    if (!photo || photo.order.userId !== userId) throw new AppError(404, 'Photo not found');

    const filepath = join(this.uploadsDir, photo.filename);
    if (existsSync(filepath)) unlinkSync(filepath);

    await prisma.photo.delete({ where: { id: photoId } });
  }
}