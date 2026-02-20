import { WorkflowDefinition } from '../types/workflow';
import { nodeRegistry } from '../registry/node.registry';
import { ExecutionContext } from '../runtime/context';
import { randomUUID } from 'crypto';

export class WorkflowExecutor {
  async execute(
    workflow: WorkflowDefinition,
    userId: string
  ): Promise<ExecutionContext> {
    // 1️⃣ Create execution context
    const context: ExecutionContext = {
      executionId: randomUUID(),
      userId,
      data: {},
      logs: [],
    };

    context.logs.push('Execution started');

    // 2️⃣ Sort nodes (simple sequential version for now)
    const sortedNodes = this.topologicalSort(workflow);

    // 3️⃣ Execute each node
    for (const node of sortedNodes) {
      context.logs.push(`Executing node ${node.id} (${node.type})`);

      const implementation = nodeRegistry.get(node.type);

      const output = await implementation.run(
        context,
        node.config
      );

      // Store result in context
      context.data[node.id] = output;

      context.logs.push(`Node ${node.id} completed`);
    }

    context.logs.push('Execution completed');

    return context;
  }

  /**
   * Simple topological sort
   */
  private topologicalSort(
    workflow: WorkflowDefinition
  ) {
    const { nodes, edges } = workflow;

    const visited = new Set<string>();
    const result: typeof nodes = [];

    const adjacency = new Map<string, string[]>();

    // Build adjacency list
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

    // Start DFS from all nodes
    for (const node of nodes) {
      dfs(node.id);
    }

    return result;
  }
}