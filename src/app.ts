import Fastify from 'fastify';
import cors from '@fastify/cors';
import corsPlugin from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';


// import { userRoutes } from './routes/userRoutes';
// import { authRoutes } from './routes/authRoutes';
// import { categoryRoutes } from './routes/categoryRoutes';
// import { productRoutes } from './routes/productRoutes';
// import { orderRoutes } from './routes/orderRoutes';

const app = Fastify();

// Register CORS plugin
app.register(cors, {
  origin: '*', // Allow all origins (adjust as needed for security)
});

// Register routes
// app.register(userRoutes, { prefix: '/users' });
// app.register(authRoutes, { prefix: '/auth' });
// app.register(categoryRoutes, { prefix: '/categories' });
// app.register(productRoutes, { prefix: '/products' });
// app.register(orderRoutes, { prefix: '/orders' });

// Start the server
const buildApp = async () => {
    const app = Fastify({
      logger: false
    });

    const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_BYTES || 100 * 1024 * 1024); // 100 MB

    await app.register(corsPlugin, {
        origin: '*',
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });

    app.register(fastifyMultipart, {
      limits: {
        fileSize: MAX_UPLOAD_BYTES,
      },
      attachFieldsToBody: false,
    });

    await app.get('/', () => {
        return 'OS SYSTEM\nVersion 1.0.0';
    });

    return app;
};

export default buildApp;