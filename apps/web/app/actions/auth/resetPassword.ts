'use server';

import { createClient } from '@/lib/supabase/server';

export async function resetPassword(formData: FormData) {
  const supabase = createClient();

  const email = formData.get('email') as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/update-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
