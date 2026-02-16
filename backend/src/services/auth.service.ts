import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import { generateToken } from '../utils/generatetoken';

export const registerUser = async (
  email: string,
  password: string,
  name?: string
) => {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error('User already exists');
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
    },
  });

  const token = generateToken(user.id);

  return { user, token };
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user.id);

  return { user, token };
};