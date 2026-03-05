"use client"

import { useEffect, Suspense } from "react"
import { toast } from "sonner"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

function WelcomeToastContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (searchParams.get("welcome") === "true") {
      toast.success("Parabéns, seu setup está completo!", {
        description: "Seus assistentes IA estão prontos para te ajudar.",
        duration: 5000,
      })

      // Remove welcome param from URL without reloading
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.delete("welcome")
      const newUrl = `${pathname}${newParams.toString() ? `?${newParams.toString()}` : ''}`
      router.replace(newUrl, { scroll: false })
    }
  }, [searchParams, pathname, router])

  return null
}

export function WelcomeToast() {
  return (
    <Suspense fallback={null}>
      <WelcomeToastContent />
    </Suspense>
  )
}
