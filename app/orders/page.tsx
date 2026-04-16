"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { OrdersTable } from "@/components/dashboard/orders-table"
import { useDashboard } from "@/lib/dashboard-context"
import { Button } from "@/components/ui/button"
import { Download, Clock, Truck, CheckCircle, DollarSign } from "lucide-react"

export default function OrdersPage() {
  const { orders, showToast } = useDashboard()

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    totalRevenue: orders.reduce((acc, o) => acc + o.total, 0),
  }

  const handleExport = () => {
    showToast("Exportando pedidos a CSV (simulado)", "info")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
              Pedidos
            </h1>
            <p className="text-muted-foreground">
              Gestiona y rastrea todos los pedidos
            </p>
          </div>
          <Button 
            onClick={handleExport}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,200,255,0.3)] transition-all hover:shadow-[0_0_30px_rgba(0,200,255,0.5)]"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-border bg-card/80 p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ingresos</p>
              <p className="text-xl font-bold text-primary">${stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card/80 p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-foreground">
              <span className="text-lg font-bold">{stats.total}</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-sm font-medium text-foreground">Pedidos</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card/80 p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="text-lg font-bold text-warning">{stats.pending}</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card/80 p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Enviados</p>
              <p className="text-lg font-bold text-primary">{stats.shipped}</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card/80 p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Entregados</p>
              <p className="text-lg font-bold text-success">{stats.delivered}</p>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <OrdersTable />
      </div>
    </DashboardLayout>
  )
}
