import { ExecutionContext } from '../runtime/context';

export interface BaseNode {
  run(
    context: ExecutionContext,
    config: Record<string, any>
  ): Promise<any>;
}