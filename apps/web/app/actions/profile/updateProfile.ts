'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Não autenticado' };

    const profileData: any = {};
    
    if (formData.has('full_name')) profileData.full_name = formData.get('full_name') as string;
    if (formData.has('phone')) profileData.phone = formData.get('phone') as string;
    if (formData.has('whatsapp_number')) profileData.whatsapp_number = formData.get('whatsapp_number') as string;

    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id);
    
    if (error) return { error: error.message };
    
    revalidatePath('/app/profile');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
