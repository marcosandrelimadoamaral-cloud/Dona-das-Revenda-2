'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateClient(id: string, formData: FormData) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Não autenticado' };

    const clientData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string || null,
      phone: formData.get('phone') as string,
      birth_date: formData.get('birth_date') as string || null,
      skin_type: formData.get('skin_type') as string || null,
    };

    const { error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) return { error: error.message };
    
    revalidatePath('/app/clients');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
