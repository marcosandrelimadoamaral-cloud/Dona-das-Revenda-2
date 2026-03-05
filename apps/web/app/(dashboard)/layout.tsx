import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayoutClient } from "@/components/dashboard/DashboardLayoutClient"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()

  // 1. Fetch User
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // 1.5 Fetch Profile (Onboarding Block & Trial fallback)
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed, created_at')
    .eq('id', user.id)
    .single()

  const headersList = headers()
  const currentPath = headersList.get('x-pathname') || ""

  console.log(`[SubscriptionGuard] User: ${user.id} | Path: ${currentPath} | Onboarded: ${profile?.onboarding_completed}`)

  if (profile && !profile.onboarding_completed && !currentPath.startsWith('/onboarding')) {
    redirect('/onboarding')
  }

  // 2. Fetch Subscription Status
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
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

  // Fallback trial based on profile creation (for brand new users without a subscription record yet)
  if (!isPro && !subscription && profile?.created_at) {
    const createdDate = new Date(profile.created_at).getTime()
    const trialEnd = createdDate + (7 * 24 * 60 * 60 * 1000)

    daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24))
    isTrialValid = daysRemaining > 0
  }

  console.log('[DEBUG TRIAL]', { createdAt: profile?.created_at, daysRemaining, isTrialValid, isPro, hasSubscription: !!subscription })

  // 3. Subscription Guard (The Paywall)
  if (!isPro && !isTrialValid) {
    // Block any route EXCEPT the billing page itself
    if (currentPath !== '/billing') {
      redirect('/billing?expired=true')
    }
  }

  // 4. Render Layout Wrapped
  return (
    <DashboardLayoutClient user={user} isPro={isPro} daysRemaining={daysRemaining} isTrialValid={isTrialValid}>
      {children}
    </DashboardLayoutClient>
  )
}
