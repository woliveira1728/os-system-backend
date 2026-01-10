import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/appError';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export const authGuard = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError(401, 'No token provided');
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      throw new AppError(401, 'Invalid token format');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      email: string;
      role?: string;
    };

    (request as any).user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }
    return reply.code(401).send({ message: 'Invalid token' });
  }
};