"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { UsersChart } from "@/components/dashboard/users-chart"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { OrdersTable } from "@/components/dashboard/orders-table"
import { useDashboard } from "@/lib/dashboard-context"
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
} from "lucide-react"

export default function DashboardPage() {
  const { kpiData, setOrderFilter, orders, products } = useDashboard()

  const pendingOrders = orders.filter(o => o.status === "pending").length
  const activeProducts = products.filter(p => p.status === "active").length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Bienvenido de nuevo. Aquí está el resumen de tu tienda.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Ventas Totales"
            value={kpiData.totalSales.toLocaleString()}
            change={kpiData.salesGrowth}
            icon={DollarSign}
            prefix="$"
            details={{
              description: "Resumen completo de ventas del período actual",
              breakdown: [
                { label: "Electrónica", value: "$26,075", change: 15.2 },
                { label: "Ropa", value: "$18,625", change: 8.4 },
                { label: "Hogar", value: "$14,900", change: 12.1 },
                { label: "Deportes", value: "$8,940", change: -2.3 },
                { label: "Otros", value: "$5,960", change: 5.7 },
              ],
            }}
          />
          <KpiCard
            title="Ingresos Mensuales"
            value={kpiData.monthlyRevenue.toLocaleString()}
            change={kpiData.revenueGrowth}
            icon={TrendingUp}
            prefix="$"
            details={{
              description: "Ingresos generados en el mes actual",
              breakdown: [
                { label: "Semana 1", value: "$2,847", change: 5.2 },
                { label: "Semana 2", value: "$3,421", change: 12.3 },
                { label: "Semana 3", value: "$3,156", change: 8.1 },
                { label: "Semana 4", value: "$3,423", change: 10.4 },
              ],
            }}
          />
          <KpiCard
            title="Pedidos Pendientes"
            value={pendingOrders.toString()}
            change={kpiData.ordersGrowth}
            icon={ShoppingCart}
            onClick={() => setOrderFilter("pending")}
          />
          <KpiCard
            title="Usuarios Activos"
            value={kpiData.activeUsers.toLocaleString()}
            change={kpiData.usersGrowth}
            icon={Users}
            details={{
              description: "Usuarios activos en la plataforma",
              breakdown: [
                { label: "Nuevos (este mes)", value: "156", change: 23.5 },
                { label: "Recurrentes", value: "892", change: 12.1 },
                { label: "Premium", value: "236", change: 18.7 },
              ],
            }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SalesChart />
          <UsersChart />
        </div>

        {/* Second Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <OrdersTable />
          </div>
          <div className="space-y-6">
            <CategoryChart />
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
