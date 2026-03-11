import { Worker, Job } from "bullmq";
import { redisConnection } from "./core/queue/redis";
import { processExecution } from "./core/engine/execution.processor";

console.log("Worker started");

new Worker(
  "workflow-queue",
  async (job: Job) => {
    const { workflowId, userId, executionId } = job.data;

    await processExecution(
      workflowId,
      userId,
      executionId,
      job
    );
  },
  {
    connection: redisConnection,
    concurrency: 5
  }
);