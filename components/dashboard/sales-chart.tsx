"use client"

import { useState } from "react"
import {
  Area,
  AreaChart,
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
          Ventas: <span className="font-semibold text-cyan-600">${payload[0].value.toLocaleString()}</span>
        </p>
        <p className="mt-1 text-xs text-gray-400">Click para ver detalles</p>
      </div>
    )
  }
  return null
}

export function SalesChart() {
  const { showToast } = useDashboard()
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<"6m" | "12m">("12m")

  const displayData = timeRange === "6m" ? salesData.slice(-6) : salesData

  const handleChartClick = (data: any) => {
    if (data && data.activePayload) {
      const month = data.activePayload[0].payload.month
      const sales = data.activePayload[0].payload.sales
      setSelectedMonth(month)
      showToast(`${month}: $${sales.toLocaleString()} en ventas`, "info")
    }
  }

  const totalSales = displayData.reduce((acc, item) => acc + item.sales, 0)
  const avgSales = Math.round(totalSales / displayData.length)

  return (
    <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-premium transition-smooth hover:shadow-premium-hover">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            Ventas Mensuales
          </h3>
          <p className="text-sm text-muted-foreground">
            {selectedMonth ? `Seleccionado: ${selectedMonth}` : "Click en un punto para ver detalles"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Time Range Toggle */}
          <div className="flex rounded-lg bg-secondary/50 p-1">
            {(["6m", "12m"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  timeRange === range
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {range === "6m" ? "6 Meses" : "12 Meses"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground">Total Período</p>
          <p className="text-lg font-bold text-primary">${totalSales.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground">Promedio Mensual</p>
          <p className="text-lg font-bold text-foreground">${avgSales.toLocaleString()}</p>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={displayData} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            onClick={handleChartClick}
            style={{ cursor: "pointer" }}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#06b6d4"
              strokeWidth={2}
              fill="url(#salesGradient)"
              animationBegin={0}
              animationDuration={800}
              dot={{ r: 4, fill: "#06b6d4", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#06b6d4", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
