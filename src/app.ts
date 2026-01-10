
import 'reflect-metadata';
import Fastify from 'fastify';
import corsPlugin from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path, { join } from 'path';
import fs from 'fs';
import {
  authRouter,
  orderRouter,
  checklistRouter,
  photoRouter,
} from './routes';

const buildApp = async () => {
  const app = Fastify({ logger: false });

  const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_BYTES || 100 * 1024 * 1024); // 100 MB

  await app.register(corsPlugin, {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.register(fastifyMultipart, {
    limits: { fileSize: MAX_UPLOAD_BYTES },
    attachFieldsToBody: false,
  });

  const uploadsRoot = join(process.cwd(), 'uploads');
  await fs.promises.mkdir(uploadsRoot, { recursive: true });

  // Serve arquivos estáticos
  await app.register(fastifyStatic, {
    root: uploadsRoot,
    prefix: '/uploads/',
    index: false,
    maxAge: '1d',
  });

  await app.get('/', () => 'OS SYSTEM\nVersion 1.0.0');

  app.get('/api/health', async () => ({ status: 'ok', timestamp: new Date() }));

  await app.register(authRouter, { prefix: '/api/auth' });
  await app.register(orderRouter, { prefix: '/api/orders' });
  await app.register(checklistRouter, { prefix: '/api/checklist' });
  await app.register(photoRouter, { prefix: '/api/photos' });

  return app;
};

export default buildApp;