"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { UsersChart } from "@/components/dashboard/users-chart"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { kpiData } from "@/lib/mock-data"
import {
  TrendingUp,
  Eye,
  MousePointer,
  Timer,
} from "lucide-react"

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            Analíticas
          </h1>
          <p className="text-muted-foreground">
            Métricas detalladas de rendimiento de tu tienda
          </p>
        </div>

        {/* Analytics KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Tasa de Conversión"
            value="3.24"
            change={8.1}
            icon={TrendingUp}
            prefix=""
          />
          <KpiCard
            title="Visitas Totales"
            value="48,294"
            change={12.3}
            icon={Eye}
          />
          <KpiCard
            title="Tasa de Clics"
            value="2.8"
            change={-2.1}
            icon={MousePointer}
            prefix=""
          />
          <KpiCard
            title="Tiempo Promedio"
            value="4:32"
            change={5.7}
            icon={Timer}
          />
        </div>

        {/* Main Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SalesChart />
          <UsersChart />
        </div>

        {/* Category Distribution */}
        <div className="grid gap-6 lg:grid-cols-3">
          <CategoryChart />
          
          {/* Top Products Card */}
          <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Productos más Vendidos
              </h3>
              <p className="text-sm text-muted-foreground">
                Top 5 productos del mes
              </p>
            </div>
            <div className="space-y-4">
              {[
                { name: "iPhone 15 Pro Max", sales: 142, revenue: "$170,258" },
                { name: "MacBook Pro 16\"", sales: 89, revenue: "$222,411" },
                { name: "AirPods Pro 2", sales: 234, revenue: "$58,266" },
                { name: "iPad Pro 12.9\"", sales: 67, revenue: "$73,633" },
                { name: "Apple Watch Ultra", sales: 98, revenue: "$78,302" },
              ].map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between rounded-lg bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.sales} unidades vendidas
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {product.revenue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
