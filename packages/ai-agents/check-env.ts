import { validateAIConfig } from './src/config';

try {
  validateAIConfig();
  console.log('✅ GEMINI_API_KEY configurada corretamente.');
} catch (error: any) {
  console.error('❌ ERRO:', error.message);
  process.exit(1);
}
