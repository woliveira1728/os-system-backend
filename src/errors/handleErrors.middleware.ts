import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from './appError';
import { ZodError } from 'zod';

export class HandleErrors {
    static execute(err: Error, request: FastifyRequest, reply: FastifyReply) {
        if (err instanceof AppError) {
            return reply.status(err.statusCode).send({ message: err.message });
        }

        if (err instanceof ZodError) {
            return reply.status(400).send(err.issues);
        }
        
        console.error(err);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
}
