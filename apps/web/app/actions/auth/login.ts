'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  console.log('[LOGIN] Iniciando processo de login');
  const supabase = createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    console.log('[LOGIN] Erro: Email ou senha não fornecidos');
    return { error: 'Preencha todos os campos obrigatórios.' };
  }

  console.log('Tentando login com:', email);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log('Resultado:', { user: data.user?.id, error: error?.message });

  if (error) {
    console.log('[LOGIN] Falha na autenticação:', error.message);
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Por favor, confirme seu email antes de entrar.' };
    }
    return { error: 'Email ou senha incorretos. Verifique e tente novamente.' };
  }

  console.log('[LOGIN] Sucesso. Redirecionando para /dashboard');
  redirect('/dashboard');
}
