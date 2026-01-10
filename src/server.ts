import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import buildApp from './app';

const startServer = async () => {
    const API_PORT = process.env.API_PORT;
    const HOST = process.env.HOST;
    try {
        const app = await buildApp();
        
        await app.listen({ 
            port: Number(API_PORT), 
            host: HOST
        });
        console.log(`🚀 HTTP server running on http://${HOST}:${API_PORT}`);
        console.log(`📊 Health check: http://${HOST}:${API_PORT}/health`);
        console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}; 

startServer();