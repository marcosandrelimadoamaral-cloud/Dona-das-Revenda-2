'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSaleStatus(saleId: string, status: 'paid' | 'pending' | 'cancelled') {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Verificar se a venda pertence ao usuário
    const { data: saleCheck, error: checkError } = await supabase
      .from('sales')
      .select('id')
      .eq('id', saleId)
      .eq('user_id', user.id)
      .single()

    if (checkError || !saleCheck) {
      throw new Error('Permissão negada ou venda não encontrada')
    }

    // Atualizar
    const { error: updateError } = await supabase
      .from('sales')
      .update({ status: status })
      .eq('id', saleId)

    if (updateError) throw updateError

    // Opcional: Revalidar o cache da rota inteira para atualizar UI (Server Components)
    revalidatePath('/finance')

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao atualizar status da venda:', error)
    return { success: false, error: error.message || 'Erro ao atualizar pagamento' }
  }
}
