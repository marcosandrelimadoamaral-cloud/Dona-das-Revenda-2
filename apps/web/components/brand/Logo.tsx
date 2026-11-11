import Image from "next/image"

type LogoProps = {
  variant?: "horizontal" | "claro" | "simbolo" | "simboloClaro"
  className?: string
  priority?: boolean
}

const SRC = {
  horizontal: { src: "/brand/logo-horizontal.svg", w: 1612, h: 300 },
  claro: { src: "/brand/logo-horizontal-claro.svg", w: 1612, h: 300 },
  simbolo: { src: "/brand/simbolo-coroa-dourada.svg", w: 950, h: 990 },
  simboloClaro: { src: "/brand/simbolo-claro-coroa-dourada.svg", w: 950, h: 990 },
} as const

export function Logo({ variant = "horizontal", className = "h-9 w-auto", priority }: LogoProps) {
  const { src, w, h } = SRC[variant]
  return <Image src={src} alt="Dona da Revenda" width={w} height={h} priority={priority} className={className} />
}
