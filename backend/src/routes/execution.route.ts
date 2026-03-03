import { Router } from 'express';
import {
  runWorkflow,
  getExecution,
  getWorkflowExecutions
} from '../controllers/execution.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/:workflowId/run', authenticate, runWorkflow);
router.get('/:executionId', authenticate, getExecution);
router.get('/workflow/:workflowId', authenticate, getWorkflowExecutions);

export default router;