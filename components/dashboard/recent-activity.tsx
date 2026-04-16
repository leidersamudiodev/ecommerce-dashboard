"use client"

import { ShoppingBag, UserPlus, CreditCard, Package, Settings, Box } from "lucide-react"
import { useDashboard } from "@/lib/dashboard-context"

const iconMap = {
  order: ShoppingBag,
  user: UserPlus,
  payment: CreditCard,
  shipping: Package,
  settings: Settings,
  product: Box,
}

export function RecentActivity() {
  const { activities, showToast } = useDashboard()

  const handleActivityClick = (activity: typeof activities[0]) => {
    showToast(`Viendo detalles: ${activity.message}`, "info")
  }

  return (
    <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-premium transition-smooth hover:shadow-premium-hover">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">
          Actividad Reciente
        </h3>
        <p className="text-sm text-muted-foreground">
          Últimas acciones en la tienda
        </p>
      </div>
      <div className="space-y-3">
        {activities.map((activity, index) => {
          const IconComponent = iconMap[activity.type as keyof typeof iconMap] || ShoppingBag
          return (
            <button
              key={activity.id}
              onClick={() => handleActivityClick(activity)}
              className="group flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-secondary/30"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground">
                  {activity.message}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              {index === 0 && (
                <div className="flex h-2 w-2 shrink-0 mt-2 relative">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
