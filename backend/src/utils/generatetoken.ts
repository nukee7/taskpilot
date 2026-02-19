import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export const generateToken = (userId: string): string => {
  const payload = { userId };

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '7d',
  };

  return jwt.sign(payload, JWT_SECRET, options);
};