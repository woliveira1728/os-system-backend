import dotenv from 'dotenv';
dotenv.config();
import buildApp from './app';

const startServer = async () => {
    const API_PORT = process.env.API_PORT;
    try {
        const app = await buildApp();
        
        await app.listen({ 
            port: Number(API_PORT), 
            host: '0.0.0.0'
        });

        console.log(`Server is running on port ${API_PORT}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}; 

startServer();