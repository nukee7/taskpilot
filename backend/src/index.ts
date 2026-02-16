import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('TaskPilot API Running');
});

// Start server
const PORT: number = Number(process.env.PORT) || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});