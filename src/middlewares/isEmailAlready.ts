import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from "../lib/prisma";
import { AppError } from "../errors/appError";
import { RegisterBody } from '../interfaces';

export const isEmailAlready = async (
  request: FastifyRequest<{ Body: RegisterBody }>, 
  reply: FastifyReply
): Promise<void> => {
  const { email } = request.body;

  if (!email) {
    return;
  }

  const user = await prisma.user.findFirst({ where: { email } });

  if (user) {
    throw new AppError(409, `E-mail already registered.`);
  }
  
  return;
}