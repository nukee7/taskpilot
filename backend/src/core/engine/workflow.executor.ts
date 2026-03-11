import { WorkflowDefinition } from '../types/workflow';
import { nodeRegistry } from '../registry/node.registry';
import { ExecutionContext } from '../runtime/context';
import { SocketWorkflowEmitter } from '../runtime/socketEmitter';
import { Job } from "bullmq";

export class WorkflowExecutor {

  constructor(
    private emitter: SocketWorkflowEmitter
  ) {}

  async execute(
    workflow: WorkflowDefinition,
    userId: string,
    executionId: string,
    job: Job
  ): Promise<ExecutionContext> {

    const context: ExecutionContext = {
      executionId,
      userId,
      data: {},
      logs: [],
    };

    context.logs.push('Execution started');

    const sortedNodes = this.topologicalSort(workflow);

    for (const node of sortedNodes) {

      const implementation = nodeRegistry.get(node.type);
      const maxRetries = node.config?.retries ?? 0;

      let attempt = 0;
      let success = false;

      while (attempt <= maxRetries && !success) {

        attempt++;

        try {

          context.logs.push(
            `Executing node ${node.id}, attempt ${attempt}`
          );

          // BullMQ execution progress: step started
          await job.updateProgress({
            executionStepId: node.id,
            executionStatus: "STARTED",
            attempt
          });

          // WebSocket node event
          this.emitter.emit(executionId, {
            kind: "node",
            nodeId: node.id,
            status: "STARTED"
          });

          const output = await implementation.run(
            context,
            node.config
          );

          context.data[node.id] = output;

          context.logs.push(`Node ${node.id} completed`);

          // BullMQ execution progress: step success
          await job.updateProgress({
            executionStepId: node.id,
            executionStatus: "SUCCESS",
            output
          });

          // WebSocket node event
          this.emitter.emit(executionId, {
            kind: "node",
            nodeId: node.id,
            status: "SUCCESS",
            output
          });

          success = true;

        } catch (error: any) {

          context.logs.push(
            `Node ${node.id} failed: ${error.message}`
          );

          // BullMQ execution progress: step failure
          await job.updateProgress({
            executionStepId: node.id,
            executionStatus: "FAILED",
            error: error.message,
            attempt
          });

          if (attempt > maxRetries) {

            this.emitter.emit(executionId, {
              kind: "node",
              nodeId: node.id,
              status: "FAILED",
              error: error.message
            });

            throw error;
          }
        }
      }
    }

    context.logs.push('Execution completed');

    // Final execution progress
    await job.updateProgress({
      executionStatus: "COMPLETED"
    });

    return context;
  }

  private topologicalSort(workflow: WorkflowDefinition) {
    const { nodes, edges } = workflow;

    const visited = new Set<string>();
    const result: typeof nodes = [];
    const adjacency = new Map<string, string[]>();

    for (const edge of edges) {
      if (!adjacency.has(edge.from)) {
        adjacency.set(edge.from, []);
      }
      adjacency.get(edge.from)!.push(edge.to);
    }

    const dfs = (nodeId: string) => {
      if (visited.has(nodeId)) return;

      visited.add(nodeId);

      const neighbors = adjacency.get(nodeId) || [];

      for (const neighbor of neighbors) {
        dfs(neighbor);
      }

      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        result.unshift(node);
      }
    };

    for (const node of nodes) {
      dfs(node.id);
    }

    return result;
  }
}