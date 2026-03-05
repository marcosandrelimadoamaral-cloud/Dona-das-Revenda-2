'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signup(formData: FormData) {
  console.log('[SIGNUP] Iniciando processo de cadastro');
  const supabase = createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('full_name') as string;
  // plan is passed as hidden input when user came from landing page pricing CTA
  const plan = formData.get('plan') as string | null;

  if (!email || !password || !fullName) {
    return { error: 'Preencha todos os campos obrigatórios.' };
  }

  if (password.length < 8) {
    return { error: 'A senha deve ter pelo menos 8 caracteres.' };
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    if (error.message.includes('already registered') || error.message.includes('User already registered')) {
      return { error: 'Já existe uma conta com este email.' };
    }
    return { error: error.message };
  }

  // Se criou o user mas não tem sessão, é porque precisa confirmar o email (Confirmação Ativa no Supabase)
  if (authData.user && !authData.session) {
    console.log('[SIGNUP] Usuário criado, aguardando confirmação de email');
    redirect(`/verify-email?email=${encodeURIComponent(email)}`);
  }

  // Manual profile creation backup in case trigger fails (só chega aqui se auto-confirmar ou após confirmar)
  if (authData.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, onboarding_completed')
      .eq('id', authData.user.id)
      .single();

    if (!profile) {
      await supabase.from('profiles').insert({
        id: authData.user.id,
        full_name: fullName,
        email: email,
        onboarding_completed: false,
      });
    } else if (profile.onboarding_completed) {
      // Already fully set up — go straight to dashboard
      redirect('/dashboard');
    }
  }

  // Normalize plan names (landing page sends 'monthly'/'annual'/'quarterly'
  // or old Portuguese names 'mensal'/'anual'/'trimestral')
  const planMap: Record<string, string> = {
    monthly: 'monthly', annual: 'annual', quarterly: 'quarterly',
    mensal: 'monthly', anual: 'annual', trimestral: 'quarterly',
  };
  const normalizedPlan = plan ? planMap[plan.toLowerCase()] ?? null : null;

  if (normalizedPlan) {
    // Flow: Signup → Checkout (Stripe Elements) → Onboarding → Dashboard
    console.log('[SIGNUP] Plan selected:', normalizedPlan, '→ redirecting to /checkout');
    redirect(`/checkout?plan=${normalizedPlan}&newUser=true`);
  }

  // No plan selected — go to onboarding directly
  redirect('/onboarding');
}
