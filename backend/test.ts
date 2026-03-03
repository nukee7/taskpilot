import { GoogleGenAI } from '@google/genai';

async function listModels() {
  const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  const models = await client.models.list();

  for await (const model of models) {
    console.log(model.name);
  }
}

listModels().catch(console.error);