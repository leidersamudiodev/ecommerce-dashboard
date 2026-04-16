"use client"

import { useState, useEffect } from "react"
import { Bell, Menu, Search, X, ShoppingBag, UserPlus, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDashboard } from "@/lib/dashboard-context"

interface NavbarProps {
  onMenuClick: () => void
}

const mockNotifications = [
  { id: 1, type: "order", message: "Nuevo pedido #ORD-012 recibido", time: "Hace 2 min", read: false },
  { id: 2, type: "user", message: "Nuevo usuario registrado", time: "Hace 15 min", read: false },
  { id: 3, type: "payment", message: "Pago de $1,450 confirmado", time: "Hace 30 min", read: true },
  { id: 4, type: "order", message: "Pedido #ORD-009 enviado", time: "Hace 1 hora", read: true },
]

export function Navbar({ onMenuClick }: NavbarProps) {
  const { showToast } = useDashboard()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  useEffect(() => {
    setCurrentTime(new Date())
    const interval = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    showToast("Todas las notificaciones marcadas como leídas")
  }

  const handleNotificationClick = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    showToast("Notificación vista", "info")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      showToast(`Buscando: "${searchQuery}"`, "info")
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order": return ShoppingBag
      case "user": return UserPlus
      case "payment": return CreditCard
      default: return Bell
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 backdrop-blur-md px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-muted-foreground hover:text-foreground hover:bg-secondary"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2 rounded-xl bg-secondary/50 border border-border px-3 py-2 w-64 lg:w-80 transition-all focus-within:border-primary/30 focus-within:bg-secondary">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar productos, pedidos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded-md border border-border bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </form>
      </div>

      <div className="flex items-center gap-2">
        {/* Mobile search */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden text-muted-foreground hover:text-foreground hover:bg-secondary"
          onClick={() => showToast("Buscar (próximamente)", "info")}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
            )}
          </Button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-border bg-card shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-border p-4">
                  <h3 className="font-semibold text-foreground">Notificaciones</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-xs text-primary hover:underline"
                      >
                        Marcar todo leído
                      </button>
                    )}
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => {
                    const IconComponent = getNotificationIcon(notification.type)
                    return (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-secondary/50 ${
                          !notification.read ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          !notification.read ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                        }`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notification.read ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                        )}
                      </button>
                    )
                  })}
                </div>
                <div className="border-t border-border p-2">
                  <button 
                    onClick={() => {
                      showToast("Ver todas las notificaciones (próximamente)", "info")
                      setShowNotifications(false)
                    }}
                    className="w-full rounded-lg py-2 text-sm text-primary hover:bg-primary/10 transition-colors"
                  >
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Time */}
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground px-3 py-1.5 rounded-lg bg-secondary/30 border border-border">
          <span>
            {currentTime?.toLocaleDateString("es-ES", {
              weekday: "short",
              day: "numeric",
              month: "short",
            }) || "..."}
          </span>
        </div>
      </div>
    </header>
  )
}
