import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/auth.service';

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;

    const result = await registerUser(email, password, name);

    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({
      error: err.message,
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({
      error: err.message,
    });
  }
}