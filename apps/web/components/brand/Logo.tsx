import Image from "next/image"

type LogoProps = {
  variant?: "horizontal" | "claro" | "simbolo" | "simboloClaro"
  className?: string
  priority?: boolean
}

const SRC = {
  horizontal: { src: "/brand/logo-horizontal.svg", w: 1806, h: 345 },
  claro: { src: "/brand/logo-horizontal-claro.svg", w: 1806, h: 345 },
  simbolo: { src: "/brand/simbolo-coroa-dourada.svg", w: 950, h: 990 },
  simboloClaro: { src: "/brand/simbolo-claro-coroa-dourada.svg", w: 950, h: 990 },
} as const

// No modo escuro, as versões grená trocam automaticamente pela versão clara.
const DARK_PAIR: Partial<Record<NonNullable<LogoProps["variant"]>, keyof typeof SRC>> = {
  horizontal: "claro",
  simbolo: "simboloClaro",
}

export function Logo({ variant = "horizontal", className = "h-9 w-auto", priority }: LogoProps) {
  const { src, w, h } = SRC[variant]
  const pair = DARK_PAIR[variant]

  if (!pair) {
    return <Image src={src} alt="Dona da Revenda" width={w} height={h} priority={priority} className={className} />
  }

  const dark = SRC[pair]
  return (
    <>
      <Image src={src} alt="Dona da Revenda" width={w} height={h} priority={priority} className={`${className} dark:hidden`} />
      <Image
        src={dark.src}
        alt=""
        aria-hidden
        width={dark.w}
        height={dark.h}
        priority={priority}
        className={`${className} hidden dark:block`}
      />
    </>
  )
}
