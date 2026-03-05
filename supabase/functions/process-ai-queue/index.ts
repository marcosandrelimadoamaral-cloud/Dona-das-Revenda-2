import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Buscar jobs pendentes na fila
  const { data: jobs } = await supabase
    .from('ai_job_queue')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(5); // Processa 5 por vez

  for (const job of jobs || []) {
    try {
      // Atualizar status para processing
      await supabase
        .from('ai_job_queue')
        .update({ status: 'processing', started_at: new Date().toISOString() })
        .eq('id', job.id);

      // Executar o job baseado no tipo
      if (job.type === 'generate_content') {
        // Chamar Clara
      } else if (job.type === 'financial_report') {
        // Chamar Finn e enviar email
        await generateAndSendReport(supabase, job.user_id);
      }

      // Marcar como completo
      await supabase
        .from('ai_job_queue')
        .update({ 
          status: 'completed', 
          completed_at: new Date().toISOString(),
          result: { success: true }
        })
        .eq('id', job.id);

    } catch (error: any) {
      await supabase
        .from('ai_job_queue')
        .update({ 
          status: 'failed', 
          error: error.message,
          retry_count: job.retry_count + 1
        })
        .eq('id', job.id);
    }
  }

  return new Response(JSON.stringify({ processed: jobs?.length || 0 }));
});

async function generateAndSendReport(supabase: any, userId: string) {
  // Buscar dados do usuário
  const { data: sales } = await supabase
    .from('sales')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  // Gerar relatório com Finn...
  // Enviar email via Resend...
}
