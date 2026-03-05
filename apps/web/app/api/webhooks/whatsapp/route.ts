import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const body = await req.json();
  
  // Validar origem (Evolution API)
  const apiKey = req.headers.get('apikey');
  if (apiKey !== process.env.EVOLUTION_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Encaminhar para Edge Function ou processar diretamente
  const supabase = createClient();
  
  // ...lógica de processamento...
  
  return NextResponse.json({ received: true });
}
