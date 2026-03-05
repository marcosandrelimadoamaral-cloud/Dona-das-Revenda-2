import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Package, DollarSign, Calendar, CheckCircle2 } from "lucide-react"

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  trendLabel,
  description,
}: {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  trendLabel?: string
  description?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(trendValue || description) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {trend === "up" && <ArrowUpRight className="w-3 h-3 text-emerald-500" />}
            {trend === "down" && <ArrowDownRight className="w-3 h-3 text-rose-500" />}
            {trendValue && (
              <span
                className={
                  trend === "up"
                    ? "text-emerald-500 font-medium"
                    : trend === "down"
                    ? "text-rose-500 font-medium"
                    : "text-muted-foreground"
                }
              >
                {trendValue}
              </span>
            )}
            {trendLabel && <span className="text-muted-foreground">{trendLabel}</span>}
            {description && <span>{description}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
