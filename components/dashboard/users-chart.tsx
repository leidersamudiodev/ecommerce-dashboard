"use client"

import { useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { salesData } from "@/lib/mock-data"
import { useDashboard } from "@/lib/dashboard-context"

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    dataKey: string
  }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="mt-1 text-sm text-gray-600">
          Usuarios: <span className="font-semibold text-teal-600">{payload[0].value.toLocaleString()}</span>
        </p>
        <p className="mt-1 text-xs text-gray-400">Click para ver detalles</p>
      </div>
    )
  }
  return null
}

export function UsersChart() {
  const { showToast } = useDashboard()
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [viewType, setViewType] = useState<"total" | "growth">("total")

  // Calculate growth data
  const growthData = salesData.map((item, index) => {
    if (index === 0) return { ...item, growth: 0 }
    const prevUsers = salesData[index - 1].users
    const growth = Math.round(((item.users - prevUsers) / prevUsers) * 100)
    return { ...item, growth }
  })

  const handleBarClick = (data: any) => {
    if (data && data.activePayload) {
      const month = data.activePayload[0].payload.month
      const users = data.activePayload[0].payload.users
      setSelectedMonth(month)
      showToast(`${month}: ${users.toLocaleString()} usuarios activos`, "info")
    }
  }

  const avgUsers = Math.round(salesData.reduce((acc, item) => acc + item.users, 0) / salesData.length)
  const maxUsers = Math.max(...salesData.map(d => d.users))

  return (
    <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-premium transition-smooth hover:shadow-premium-hover">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            Usuarios Activos
          </h3>
          <p className="text-sm text-muted-foreground">
            {selectedMonth ? `Seleccionado: ${selectedMonth}` : "Evolución mensual de usuarios"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Type Toggle */}
          <div className="flex rounded-lg bg-secondary/50 p-1">
            {([
              { value: "total", label: "Total" },
              { value: "growth", label: "Crecimiento" },
            ] as const).map((type) => (
              <button
                key={type.value}
                onClick={() => setViewType(type.value)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  viewType === type.value
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground">Promedio</p>
          <p className="text-lg font-bold text-foreground">{avgUsers.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground">Máximo</p>
          <p className="text-lg font-bold text-primary">{maxUsers.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground">Crecimiento</p>
          <p className="text-lg font-bold text-success">+{Math.round(((salesData[salesData.length - 1].users - salesData[0].users) / salesData[0].users) * 100)}%</p>
        </div>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={viewType === "growth" ? growthData : salesData} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            onClick={handleBarClick}
            style={{ cursor: "pointer" }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148, 163, 184, 0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={(value) => viewType === "growth" ? `${value}%` : value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey={viewType === "growth" ? "growth" : "users"}
              fill="#14b8a6"
              radius={[4, 4, 0, 0]}
              animationBegin={0}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
