'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function updatePassword(formData: FormData) {
    const supabase = createClient();

    const password = formData.get('password') as string;

    if (!password || password.length < 8) {
        return { error: 'A senha deve ter pelo menos 8 caracteres.' };
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) {
        return { error: error.message };
    }

    // Redirect to dashboard on success, or to a success page
    redirect('/dashboard');
}
