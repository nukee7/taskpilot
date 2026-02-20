export interface ExecutionContext {
  executionId: string;
  userId: string;

  data: Record<string, any>;
  logs: string[];
}