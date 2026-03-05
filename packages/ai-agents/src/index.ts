import { ClaraAgent } from './agents/ClaraAgent';
import { FinnAgent } from './agents/FinnAgent';
import { ZaraAgent } from './agents/ZaraAgent';
import { NinaAgent } from './agents/NinaAgent';
import { LiaAgent } from './agents/LiaAgent';
import { AI_CONFIG, validateAIConfig } from './config';

export class DonaRevendaAI {
  public clara: ClaraAgent;
  public finn: FinnAgent;
  public zara: ZaraAgent;
  public nina: NinaAgent;
  public lia: LiaAgent;

  constructor() {
    validateAIConfig(); // Valida se a chave está configurada
    
    const baseConfig = {
      apiKey: AI_CONFIG.apiKey,
      temperature: AI_CONFIG.defaultTemperature
    };

    this.clara = new ClaraAgent(baseConfig);
    this.finn = new FinnAgent(baseConfig);
    this.zara = new ZaraAgent(baseConfig);
    this.nina = new NinaAgent(baseConfig);
    this.lia = new LiaAgent(baseConfig);
  }
}

// Singleton para uso nas Server Actions
let aiInstance: DonaRevendaAI | null = null;

export function getAI(): DonaRevendaAI {
  if (!aiInstance) {
    aiInstance = new DonaRevendaAI();
  }
  return aiInstance;
}

export { ClaraAgent, FinnAgent, ZaraAgent, NinaAgent, LiaAgent };
export type { AgentResponse } from './BaseAgent';
