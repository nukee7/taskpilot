import { BaseNode } from './base.node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class AINode implements BaseNode {
  private genAI: GoogleGenerativeAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in env');
    }

    this.genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );
  }

  async run(context: any, config: any): Promise<string> {
    try {
      const input = this.resolveInput(context, config);

      context.logs.push('AI Node: Calling Gemini');

      const model = this.genAI.getGenerativeModel({
        model: config.model || 'gemini-1.5-flash',
      });

      const result = await model.generateContent(input);

      const response = result.response.text();

      context.logs.push('AI Node: Completed');

      return response;
    } catch (error: any) {
      context.logs.push(
        `AI Node Error: ${error.message}`
      );

      throw new Error('Gemini execution failed');
    }
  }

  /**
   * Resolve input prompt
   */
  private resolveInput(context: any, config: any): string {
    // Use prompt template
    if (config.prompt) {
      return this.interpolate(
        config.prompt,
        context.data
      );
    }

    // Use previous node output
    if (config.inputNodeId) {
      return context.data[config.inputNodeId];
    }

    throw new Error('AI Node: No input source');
  }

  /**
   * Replace {{nodeId}} with outputs
   */
  private interpolate(
    template: string,
    data: Record<string, any>
  ): string {
    return template.replace(
      /{{(.*?)}}/g,
      (_, key) => data[key.trim()] ?? ''
    );
  }
}