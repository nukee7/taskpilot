import prisma from '../config/prisma';
import { WorkflowExecutor } from '../core/engine/workflow.executor';
import { WorkflowDefinition } from '../core/types/workflow';
import { SocketWorkflowEmitter } from '../core/runtime/socketEmitter';
import { randomUUID } from 'crypto';

const emitter = new SocketWorkflowEmitter();
const executor = new WorkflowExecutor(emitter);

export class ExecutionService {

  async start(workflowId: string, userId: string) {
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId }
    });

    if (!workflow) {
      throw new Error('Workflow not found');
    }

    const definition =
      workflow.definition as unknown as WorkflowDefinition;

    const executionId = randomUUID();

    // Create execution record first
    await prisma.execution.create({
      data: {
        workflowId,
        userId,
        executionId,
        status: 'RUNNING'
      }
    });

    // Run async
    this.runAsync(definition, userId, executionId);

    return executionId;
  }

  private async runAsync(
    definition: WorkflowDefinition,
    userId: string,
    executionId: string
  ) {
    try {
      const result = await executor.execute(
        definition,
        userId,
        executionId
      );

      await prisma.execution.update({
        where: { executionId },
        data: {
          status: 'COMPLETED',
          data: result.data as any,
          logs: result.logs as any,
          completedAt: new Date()
        }
      });

    } catch (error: any) {
      await prisma.execution.update({
        where: { executionId },
        data: {
          status: 'FAILED',
          logs: { error: error.message } as any
        }
      });
    }
  }

  async getExecution(executionId: string) {
    return prisma.execution.findUnique({
      where: { executionId }
    });
  }

  async getWorkflowExecutions(workflowId: string) {
    return prisma.execution.findMany({
      where: { workflowId },
      orderBy: { startedAt: 'desc' }
    });
  }
}

export const executionService = new ExecutionService();