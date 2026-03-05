import { GoogleGenAI, Schema } from "@google/genai";

export interface AgentConfig {
  apiKey: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface AgentResponse<T> {
  data: T;
  rawText: string;
  tokensUsed?: number;
  confidence: number;
}

export abstract class BaseAgent {
  protected ai: GoogleGenAI;
  protected config: AgentConfig;

  constructor(config: AgentConfig) {
    this.ai = new GoogleGenAI({ apiKey: config.apiKey });
    this.config = config;
  }

  protected async generate<T>(
    systemInstruction: string, 
    prompt: string,
    responseSchema?: Schema,
    context?: Record<string, any>
  ): Promise<AgentResponse<T>> {
    const enrichedPrompt = context 
      ? `${prompt}\n\nContexto: ${JSON.stringify(context, null, 2)}`
      : prompt;

    let lastError: any;
    
    // Retry logic (3 attempts)
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await this.ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: enrichedPrompt,
          config: {
            systemInstruction,
            temperature: this.config.temperature ?? 0.7,
            topP: 0.8,
            topK: 40,
            responseMimeType: "application/json",
            responseSchema: responseSchema
          }
        });

        const responseText = response.text || "{}";
        
        let data: T;
        try {
          data = JSON.parse(responseText);
        } catch {
          data = { rawResponse: responseText } as unknown as T;
        }

        return {
          data,
          rawText: responseText,
          confidence: this.calculateConfidence(responseText),
          tokensUsed: response.usageMetadata?.totalTokenCount
        };
      } catch (error: any) {
        lastError = error;
        console.error(`Attempt ${attempt} failed:`, error.message);
        if (attempt === 3) break;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    throw new Error(`Erro na geração do agente após 3 tentativas: ${lastError?.message}`);
  }

  private calculateConfidence(text: string): number {
    const hasStructure = text.includes('{') && text.includes('}');
    const length = text.length;
    let score = 0.7;
    if (hasStructure) score += 0.2;
    if (length > 100) score += 0.1;
    return Math.min(score, 1.0);
  }

  abstract execute(input: any, context?: any): Promise<any>;
}
