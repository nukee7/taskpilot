import { Router } from 'express';
import { createWorkflow, getWorkflow } from '../controllers/workflow.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, createWorkflow);
router.get('/:id', authenticate, getWorkflow);

export default router;