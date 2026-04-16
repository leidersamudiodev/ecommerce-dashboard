"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, type LucideIcon, X } from "lucide-react"
import { Modal } from "@/components/ui/modal"

interface KpiCardProps {
  title: string
  value: string
  change: number
  icon: LucideIcon
  prefix?: string
  onClick?: () => void
  details?: {
    description: string
    breakdown: Array<{ label: string; value: string; change?: number }>
  }
}

export function KpiCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  prefix = "",
  onClick,
  details 
}: KpiCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const isPositive = change >= 0

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (details) {
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        className={cn(
          "group relative overflow-hidden rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-premium transition-all duration-200 text-left w-full",
          "hover:shadow-premium-hover hover:border-primary/30",
          isPressed && "scale-[0.98]",
          (onClick || details) && "cursor-pointer"
        )}
      >
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Click ripple effect */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-active:opacity-100 transition-opacity" />
        
        <div className="relative flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-card-foreground lg:text-3xl">
              {prefix}{value}
            </p>
            <div className="flex items-center gap-1.5">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  isPositive ? "text-success" : "text-destructive"
                )}
              >
                {isPositive ? "+" : ""}{change}%
              </span>
              <span className="text-sm text-muted-foreground">vs mes anterior</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]">
            <Icon className="h-6 w-6" />
          </div>
        </div>

        {/* Click hint */}
        {(onClick || details) && (
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity">
            Click para más detalles
          </div>
        )}
      </button>

      {/* Detail Modal */}
      {details && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={title}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{details.description}</p>
            
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-foreground">{prefix}{value}</span>
                <span className={cn(
                  "text-sm font-medium",
                  isPositive ? "text-success" : "text-destructive"
                )}>
                  {isPositive ? "+" : ""}{change}% vs mes anterior
                </span>
              </div>

              <div className="space-y-3">
                {details.breakdown.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{item.value}</span>
                      {item.change !== undefined && (
                        <span className={cn(
                          "text-xs",
                          item.change >= 0 ? "text-success" : "text-destructive"
                        )}>
                          {item.change >= 0 ? "+" : ""}{item.change}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
