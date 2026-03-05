'use server'

import { createClient } from '@/lib/supabase/server'

export async function getSubscriptionStatus() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { daysRemaining: 0, isPro: false, isTrialValid: false }

    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()

    const { data: profile } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('id', user.id)
        .single()

    let isPro = false
    let isTrialValid = false
    let daysRemaining = 0

    const now = new Date().getTime()

    if (subscription) {
        const periodEnd = new Date(subscription.current_period_end).getTime()
        isPro = subscription.status === 'active'
        if (subscription.status === 'trialing') {
            daysRemaining = Math.ceil((periodEnd - now) / (1000 * 60 * 60 * 24))
            isTrialValid = daysRemaining > 0
        }
    }

    // Fallback: profile creation date + 7 days
    if (!isPro && !subscription && profile?.created_at) {
        const createdDate = new Date(profile.created_at).getTime()
        const trialEnd = createdDate + (7 * 24 * 60 * 60 * 1000)
        daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24))
        isTrialValid = daysRemaining > 0
    }

    return { daysRemaining, isPro, isTrialValid }
}
