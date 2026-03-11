import prisma from "../../config/prisma";
import { WorkflowExecutor } from "./workflow.executor";
import { SocketWorkflowEmitter } from "../runtime/socketEmitter";
import { WorkflowDefinition } from "../types/workflow";
import { Job } from "bullmq";

const emitter = new SocketWorkflowEmitter();
const executor = new WorkflowExecutor(emitter);

export async function processExecution(
  workflowId: string,
  userId: string,
  executionId: string,
  job: Job
) {

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId }
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  const definition =
    workflow.definition as unknown as WorkflowDefinition;

  const result = await executor.execute(
    definition,
    userId,
    executionId,
    job
  );

  await prisma.execution.update({
    where: { executionId },
    data: {
      status: "COMPLETED",
      data: result.data as any,
      logs: result.logs as any,
      completedAt: new Date()
    }
  });

  return result;
}