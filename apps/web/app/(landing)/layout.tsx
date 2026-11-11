import { ContentProtection } from "@/components/brand/ContentProtection"

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ContentProtection />
      {children}
    </>
  )
}
