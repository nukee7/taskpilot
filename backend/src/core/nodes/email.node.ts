import { BaseNode } from './base.node';
import { ExecutionContext } from '../runtime/context';

export class EmailNode implements BaseNode {
  async run(
    context: ExecutionContext,
    config: Record<string, any>
  ) {
    const to = config.to;
    const message = config.message;

    // Later: Send via API
    context.logs.push(`Email sent to ${to}`);

    return {
      success: true,
    };
  }
}