import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import { generateToken } from '../utils/generatetoken';

// Register
export async function registerUser(
  email: string,
  password: string,
  name?: string
) {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error('Email already registered');
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

  // Remove password
  const { password: _, ...safeUser } = user;

  return {
    token,
    user: safeUser,
  };
}

// Login
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user.id);

  // Remove password
  const { password: _, ...safeUser } = user;

  return {
    token,
    user: safeUser,
  };
}