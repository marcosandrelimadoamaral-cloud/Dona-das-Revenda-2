import { createClient } from 'jsr:@supabase/supabase-js@2';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, sender, phone } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Buscar usuário dono deste número de WhatsApp
    const { data: userData } = await supabase
      .from('profiles')
      .select('id, whatsapp_number, ai_agents_config')
      .eq('whatsapp_number', phone)
      .single();

    if (!userData) {
      return new Response(JSON.stringify({ error: 'Número não cadastrado' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verificar se Zara está ativa e em modo automático
    const zaraConfig = userData.ai_agents_config?.find((a: any) => a.agent_type === 'zara');
    
    if (zaraConfig?.is_active && zaraConfig?.auto_execute) {
      // Buscar contexto do cliente
      const { data: client } = await supabase
        .from('clients')
        .select('*')
        .eq('phone', sender)
        .eq('user_id', userData.id)
        .single();

      const { data: products } = await supabase
        .from('user_products')
        .select('*')
        .eq('user_id', userData.id)
        .eq('status', 'active');

      // Chamar Zara (Gemini) para gerar resposta
      const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `
Você é Zara, consultora de vendas. Responda à mensagem do cliente de forma natural e curta (máx 3 linhas).

CLIENTE: ${client?.name || 'Novo cliente'}
HISTÓRICO: ${JSON.stringify(client?.purchase_history_summary || {})}
MENSAGEM RECEBIDA: "${message.text}"
PRODUTOS DISPONÍVEIS: ${products?.map((p: any) => p.custom_name).join(', ')}

Responda como se estivesse no WhatsApp, de forma amigável e consultiva.
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Enviar resposta de volta via Evolution API
      await fetch(`${Deno.env.get('EVOLUTION_API_URL')}/message/sendText/${Deno.env.get('EVOLUTION_INSTANCE')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': Deno.env.get('EVOLUTION_API_KEY')!
        },
        body: JSON.stringify({
          number: sender,
          text: responseText
        })
      });

      // Salvar conversa no banco
      await supabase.from('whatsapp_conversations').insert({
        user_id: userData.id,
        phone_number: sender,
        messages: [
          { role: 'client', content: message.text, timestamp: new Date().toISOString() },
          { role: 'ai', content: responseText, timestamp: new Date().toISOString() }
        ],
        ai_handled: true
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
