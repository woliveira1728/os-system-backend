import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { AuthController } from '../controllers';
import { AuthService } from '../services';
import { isEmailAlready } from '../middlewares/isEmailAlready';

container.registerSingleton('AuthService', AuthService);
const authController = container.resolve(AuthController);

export const authRouter = async (fastify: FastifyInstance) => {
    
    fastify.post('/login', async (request, reply) => {
        return authController.login(request, reply);
    });

    fastify.post(
        '/register',
        { preHandler: [isEmailAlready] },
        async (request, reply) => {
            return authController.register(request, reply);
        }
    );
};