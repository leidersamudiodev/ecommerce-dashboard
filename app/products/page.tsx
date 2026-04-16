"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProductsTable } from "@/components/dashboard/products-table"
import { useDashboard } from "@/lib/dashboard-context"
import { Package, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

export default function ProductsPage() {
  const { products } = useDashboard()

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === "active").length,
    lowStock: products.filter(p => p.status === "low_stock").length,
    inactive: products.filter(p => p.status === "inactive").length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            Productos
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu inventario de productos
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card/80 p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Productos</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card/80 p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Activos</p>
              <p className="text-2xl font-bold text-success">{stats.active}</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card/80 p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stock Bajo</p>
              <p className="text-2xl font-bold text-warning">{stats.lowStock}</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card/80 p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inactivos</p>
              <p className="text-2xl font-bold text-muted-foreground">{stats.inactive}</p>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <ProductsTable />
      </div>
    </DashboardLayout>
  )
}
