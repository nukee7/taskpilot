import { BaseNode } from './base.node';
import { ExecutionContext } from '../runtime/context';

export class TriggerNode implements BaseNode {
  async run(context: ExecutionContext) {
    context.logs.push('Workflow triggered');

    return {
      triggeredAt: new Date().toISOString(),
    };
  }
}