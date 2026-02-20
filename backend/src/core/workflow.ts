// A single node in workflow
export interface WorkflowNode {
  id: string;
  type: string; // trigger | ai | email | etc
  config: Record<string, any>;
}

// Connection between nodes
export interface WorkflowEdge {
  from: string;
  to: string;
}

// Whole workflow graph
export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}