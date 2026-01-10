import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';
import { AuthService } from '../services';
import { AppError } from '../errors/appError';
import { RegisterBody, LoginBody } from '../interfaces';


@injectable()
export class AuthController {
    constructor(
        @inject('AuthService')
        private authService: AuthService,
    ) {}
    
    async login(request: FastifyRequest, reply: FastifyReply): Promise<any> {
        try {
            const loginData: LoginBody = request.body as LoginBody;

            const result = await this.authService.login(loginData);
            return reply.code(200).send(result);
        } catch (error) {
            if (error instanceof AppError) {
                return reply.code(error.statusCode).send({ message: error.message });
            }
            return reply.code(500).send({ message: 'Internal server error' });
        }
    }

    async register(request: FastifyRequest, reply: FastifyReply): Promise<any> {
        try {
            const userRegister: RegisterBody = request.body as RegisterBody;

            const result = await this.authService.register(userRegister);
            return reply.code(201).send(result);
        } catch (error) {
            if (error instanceof AppError) {
                return reply.code(error.statusCode).send({ message: error.message });
            }
            return reply.code(500).send({ message: 'Internal server error' });
        }
    }
}