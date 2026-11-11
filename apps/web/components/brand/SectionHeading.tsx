export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: "center" | "left"
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""} mb-14`}>
      {eyebrow && (
        <p
          className={`inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-ouro-escuro mb-4`}
        >
          <span className="h-px w-8 bg-brand-ouro" aria-hidden />
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-5xl font-bold leading-[1.1] text-foreground">{title}</h2>
      {subtitle && <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{subtitle}</p>}
    </div>
  )
}
