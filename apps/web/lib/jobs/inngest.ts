import { Inngest } from 'inngest';
import { createClient } from '@/lib/supabase/server';

export const inngest = new Inngest({ id: 'dona-revenda' });

// Job: Processar nota fiscal (OCR pesado)
export const processInvoiceJob = inngest.createFunction(
  { id: 'process-invoice' },
  { event: 'invoice/uploaded' },
  async ({ event, step }) => {
    const { userId, filePath } = event.data as any;
    
    // 1. Baixar imagem do Storage
    const image = await step.run('download-image', async () => {
      const supabase = createClient();
      const { data } = await supabase.storage
        .from('invoices')
        .download(filePath);
      return data;
    });
    
    // 2. Processar com Gemini Vision (pode demorar)
    const extractedData = await step.run('extract-data', async () => {
      // Chamar Gemini Vision...
      return { products: [], total: 0 };
    });
    
    // 3. Inserir no banco
    await step.run('save-products', async () => {
      const supabase = createClient();
      for (const product of extractedData.products as any[]) {
        await supabase.from('user_products').insert({
          user_id: userId,
          ...product
        });
      }
    });
    
    // 4. Notificar usuário
    await step.run('notify-user', async () => {
      // Enviar notificação push/email
    });
    
    return { success: true, productsCount: extractedData.products.length };
  }
);

// Job: Relatório semanal automático (Finn)
export const weeklyReportJob = inngest.createFunction(
  { id: 'weekly-report' },
  { cron: 'TZ=America/Sao_Paulo 0 9 * * 1' }, // Segunda 9h
  async ({ step }) => {
    const supabase = createClient();
    
    // Buscar todos os usuários Pro/Business
    const { data: users } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .in('plan_type', ['pro', 'business']);
    
    for (const user of users || []) {
      await step.run(`report-${user.id}`, async () => {
        // Gerar relatório com Finn
        // Enviar email via Resend
      });
    }
  }
);
