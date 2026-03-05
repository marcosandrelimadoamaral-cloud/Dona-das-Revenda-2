export const AI_CONFIG = {
  apiKey: process.env.GEMINI_API_KEY || '',
  defaultTemperature: 0.7,
  maxOutputTokens: 2048,
  timeout: 30000, // 30 segundos
  retries: 3
};

// Validação de configuração
export function validateAIConfig(): void {
  if (!AI_CONFIG.apiKey || AI_CONFIG.apiKey === 'AIzaSyC1XxxXxxXxxXxxXxxXxxXxxXxxXxxXxxXxx') {
    throw new Error('GEMINI_API_KEY não configurada. Verifique seu arquivo .env.local');
  }
  
  if (!AI_CONFIG.apiKey.startsWith('AIza')) {
    throw new Error('GEMINI_API_KEY parece inválida. Deve começar com "AIza"');
  }
}
