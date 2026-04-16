"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Store,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { useDashboard } from "@/lib/dashboard-context"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Productos", href: "/products", icon: Package },
  { name: "Pedidos", href: "/orders", icon: ShoppingCart },
  { name: "Analíticas", href: "/analytics", icon: BarChart3 },
  { name: "Configuración", href: "/settings", icon: Settings },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { showToast } = useDashboard()

  const handleLogout = () => {
    showToast("Sesión cerrada (simulado)", "info")
    setShowLogoutModal(false)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary glow-cyan transition-transform group-hover:scale-105">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">
              ShopAdmin
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground lg:hidden transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground border border-transparent"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
                  )}
                />
                {item.name}
                {isActive && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-primary glow-cyan-sm" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 text-primary border border-primary/20">
              <span className="text-sm font-semibold">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                John Doe
              </p>
              <p className="text-xs text-muted-foreground truncate">
                admin@shop.com
              </p>
            </div>
            <button 
              onClick={() => setShowLogoutModal(true)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-border hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Cerrar Sesión"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            ¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder al panel.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleLogout}
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
            <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
