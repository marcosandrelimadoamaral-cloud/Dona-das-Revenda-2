import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const pathname = request.nextUrl.pathname
  requestHeaders.set('x-pathname', pathname)

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Landing pages públicas e assets - permitimos acesso livre
  const isPublicRoute =
    pathname === '/' ||
    pathname.startsWith('/termos') ||
    pathname.startsWith('/privacidade') ||
    pathname.startsWith('/sobre') ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/cookies') ||
    pathname.startsWith('/lgpd') ||
    pathname.startsWith('/carreiras') ||
    pathname.startsWith('/contato') ||
    pathname.startsWith('/api/webhooks') // Webhooks do Stripe/MercadoPago

  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/verify-email') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/update-password')

  if (isPublicRoute) {
    return response
  }

  // Se não tem usuário e não é rota de auth ou pública → login
  if (!user && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se está na rota de auth e JÁ está logado
  if (user && isAuthRoute) {
    const { data: profile } = await supabase.from('profiles').select('onboarding_completed').eq('id', user.id).single()
    if (!profile?.onboarding_completed) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Se o usuário está logado, tenta acessar qualquer página interna
  if (user && !isAuthRoute) {
    if (pathname.startsWith('/onboarding')) {
      const { data: profile } = await supabase.from('profiles').select('onboarding_completed').eq('id', user.id).single()
      if (profile?.onboarding_completed) {
        return NextResponse.redirect(new URL('/dashboard', request.url)) // Ja completou, nao pode acessar onboarding
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
