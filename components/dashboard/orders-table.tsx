"use client"

import { useState } from "react"
import { type Order } from "@/lib/mock-data"
import { useDashboard } from "@/lib/dashboard-context"
import { cn } from "@/lib/utils"
import { Package, Truck, CheckCircle2, Clock, Eye, MoreHorizontal, ChevronDown } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

export function OrdersTable() {
  const { orders, orderFilter, setOrderFilter, updateOrderStatus, showToast } = useDashboard()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const filteredOrders = orderFilter === "all" 
    ? orders 
    : orders.filter(o => o.status === orderFilter)

  const getStatusInfo = (status: Order["status"]) => {
    const config = {
      pending: {
        label: "Pendiente",
        icon: Clock,
        className: "bg-warning/15 text-warning border-warning/25",
      },
      shipped: {
        label: "Enviado",
        icon: Truck,
        className: "bg-primary/15 text-primary border-primary/25",
      },
      delivered: {
        label: "Entregado",
        icon: CheckCircle2,
        className: "bg-success/15 text-success border-success/25",
      },
    }
    return config[status]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    setIsLoading(orderId)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    updateOrderStatus(orderId, newStatus)
    setIsLoading(null)
    setShowStatusMenu(null)
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
  }

  const filterButtons: Array<{ label: string; value: Order["status"] | "all" }> = [
    { label: "Todos", value: "all" },
    { label: "Pendientes", value: "pending" },
    { label: "Enviados", value: "shipped" },
    { label: "Entregados", value: "delivered" },
  ]

  return (
    <>
      <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm shadow-premium">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Pedidos Recientes
            </h3>
            <p className="text-sm text-muted-foreground">
              {filteredOrders.length} de {orders.length} pedidos
            </p>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setOrderFilter(btn.value)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  orderFilter === btn.value
                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Pedido
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Estado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status)
                const StatusIcon = statusInfo.icon
                return (
                  <tr
                    key={order.id}
                    className={cn(
                      "group transition-colors hover:bg-secondary/20",
                      isLoading === order.id && "opacity-50"
                    )}
                  >
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                          <Package className="h-5 w-5" />
                        </div>
                        <span className="font-medium text-card-foreground">
                          {order.id}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div>
                        <p className="font-medium text-card-foreground">
                          {order.customer}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.email}
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                      {formatDate(order.date)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-primary">
                      ${order.total.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setShowStatusMenu(showStatusMenu === order.id ? null : order.id)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all hover:opacity-80",
                            statusInfo.className
                          )}
                        >
                          {isLoading === order.id ? (
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <StatusIcon className="h-3 w-3" />
                          )}
                          {statusInfo.label}
                          <ChevronDown className="h-3 w-3" />
                        </button>

                        {/* Status Dropdown */}
                        {showStatusMenu === order.id && (
                          <div className="absolute left-0 top-full z-50 mt-1 w-36 rounded-lg border border-border bg-card p-1 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                            {(["pending", "shipped", "delivered"] as const).map((status) => {
                              const info = getStatusInfo(status)
                              const StatusIconItem = info.icon
                              return (
                                <button
                                  key={status}
                                  onClick={() => handleStatusChange(order.id, status)}
                                  className={cn(
                                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
                                    order.status === status
                                      ? "bg-secondary text-foreground"
                                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                  )}
                                >
                                  <StatusIconItem className="h-3 w-3" />
                                  {info.label}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => handleViewDetails(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No hay pedidos con este filtro</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Detalle del Pedido ${selectedOrder?.id}`}
        size="md"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-secondary/30 p-3">
                <p className="text-xs text-muted-foreground">Cliente</p>
                <p className="font-medium text-foreground">{selectedOrder.customer}</p>
                <p className="text-xs text-muted-foreground">{selectedOrder.email}</p>
              </div>
              <div className="rounded-lg bg-secondary/30 p-3">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-primary">${selectedOrder.total.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-secondary/30 p-3">
                <p className="text-xs text-muted-foreground">Fecha</p>
                <p className="font-medium text-foreground">{formatDate(selectedOrder.date)}</p>
              </div>
              <div className="rounded-lg bg-secondary/30 p-3">
                <p className="text-xs text-muted-foreground">Items</p>
                <p className="font-medium text-foreground">{selectedOrder.items} productos</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {selectedOrder.status === "pending" && (
                <Button
                  onClick={() => {
                    handleStatusChange(selectedOrder.id, "shipped")
                    setSelectedOrder(null)
                  }}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Marcar como Enviado
                </Button>
              )}
              {selectedOrder.status === "shipped" && (
                <Button
                  onClick={() => {
                    handleStatusChange(selectedOrder.id, "delivered")
                    setSelectedOrder(null)
                  }}
                  className="flex-1 bg-success text-white hover:bg-success/90"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Marcar como Entregado
                </Button>
              )}
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
