import { BaseNode } from '../nodes/base.node';

class NodeRegistry {
  private registry = new Map<string, BaseNode>();

  /**
   * Register a node implementation
   */
  register(type: string, node: BaseNode) {
    if (this.registry.has(type)) {
      throw new Error(`Node type "${type}" already registered`);
    }

    this.registry.set(type, node);
  }

  /**
   * Get node implementation by type
   */
  get(type: string): BaseNode {
    const node = this.registry.get(type);

    if (!node) {
      throw new Error(`Node type "${type}" not found in registry`);
    }

    return node;
  }

  /**
   * Check if node exists
   */
  has(type: string): boolean {
    return this.registry.has(type);
  }
}

// Singleton instance
export const nodeRegistry = new NodeRegistry();