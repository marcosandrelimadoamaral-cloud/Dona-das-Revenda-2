import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  // Buscar todos os usuários Pro
  const { data: users } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('plan_type', 'pro');

  for (const user of users || []) {
    // Verificar aniversariantes
    const { data: birthdays } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .eq('birth_date', new Date().toISOString().split('T')[0]);

    if (birthdays && birthdays.length > 0) {
      // Adicionar à fila para Lia enviar mensagem
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Aniversariantes hoje!',
        message: `Você tem ${birthdays.length} cliente(s) fazendo aniversário`,
        type: 'birthday'
      });
    }

    // Verificar estoque crítico (Nina)
    const { data: lowStock } = await supabase
      .from('user_products')
      .select('*')
      .eq('user_id', user.id)
      .lte('current_stock', 5);

    if (lowStock && lowStock.length > 0) {
      await supabase.from('notifications').insert(
        lowStock.map((p: any) => ({
          user_id: user.id,
          title: 'Estoque baixo!',
          message: `${p.custom_name} está com apenas ${p.current_stock} unidades`,
          type: 'stock_alert'
        }))
      );
    }
  }

  return new Response('Automações executadas');
});
