import { injectable } from 'tsyringe';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/appError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterBody, LoginBody, LoginResponse } from '../interfaces';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

@injectable()
export class AuthService {
  async login(loginData: LoginBody): Promise<LoginResponse> {
    const { email, password } = loginData;

    if (!email || !password) {
      throw new AppError(400, 'Email and password are required');
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new AppError(403, 'User account is inactive');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new AppError(401, 'Invalid email or password');
    }

    const token = jwt.sign(
      { 
        sub: user.id, 
        email: user.email,
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(
    userRegister: RegisterBody
  ): Promise<{ id: string; name: string; email: string; phone?: string; role: string }> {
    const { email, name, password, phone, avatarUrl } = userRegister;

    if (!email || !password || !name) {
      throw new AppError(400, 'Name, email and password are required');
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError(409, 'Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone: phone || null,
        avatarUrl: avatarUrl || null,
        role: 'TECHNICIAN',
        isActive: true,
      },
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || undefined,
      role: newUser.role,
    };
  }
}