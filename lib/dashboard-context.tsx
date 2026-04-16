"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { products as initialProducts, orders as initialOrders, kpiData as initialKpiData, type Product, type Order } from "./mock-data"

interface DashboardState {
  products: Product[]
  orders: Order[]
  kpiData: typeof initialKpiData
  selectedCategory: string | null
  orderFilter: Order["status"] | "all"
  settings: {
    notifications: boolean
    darkMode: boolean
    emailAlerts: boolean
    soundEffects: boolean
    autoSave: boolean
    language: string
    timezone: string
  }
}

interface DashboardContextType extends DashboardState {
  // Product actions
  addProduct: (product: Product) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  
  // Order actions
  updateOrderStatus: (id: string, status: Order["status"]) => void
  
  // Filter actions
  setSelectedCategory: (category: string | null) => void
  setOrderFilter: (filter: Order["status"] | "all") => void
  
  // Settings actions
  updateSettings: (key: keyof DashboardState["settings"], value: string | boolean) => void
  
  // Toast
  showToast: (message: string, type?: "success" | "error" | "info") => void
  
  // Activity
  activities: Activity[]
  addActivity: (activity: Omit<Activity, "id" | "time">) => void
}

interface Activity {
  id: number
  type: "order" | "user" | "payment" | "shipping" | "product" | "settings"
  message: string
  time: string
}

const DashboardContext = createContext<DashboardContextType | null>(null)

const STORAGE_KEY = "dashboard-state"

function getInitialState(): DashboardState {
  if (typeof window === "undefined") {
    return {
      products: initialProducts,
      orders: initialOrders,
      kpiData: initialKpiData,
      selectedCategory: null,
      orderFilter: "all",
      settings: {
        notifications: true,
        darkMode: true,
        emailAlerts: true,
        soundEffects: false,
        autoSave: true,
        language: "es",
        timezone: "America/Mexico_City",
      },
    }
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...parsed,
        products: parsed.products || initialProducts,
        orders: parsed.orders || initialOrders,
        kpiData: parsed.kpiData || initialKpiData,
      }
    }
  } catch {
    // Ignore parse errors
  }
  
  return {
    products: initialProducts,
    orders: initialOrders,
    kpiData: initialKpiData,
    selectedCategory: null,
    orderFilter: "all",
    settings: {
      notifications: true,
      darkMode: true,
      emailAlerts: true,
      soundEffects: false,
      autoSave: true,
      language: "es",
      timezone: "America/Mexico_City",
    },
  }
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(getInitialState)
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: string }>>([])
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, type: "order", message: "Nuevo pedido #ORD-011 recibido", time: "Hace 5 min" },
    { id: 2, type: "user", message: "Nuevo usuario registrado: Ana López", time: "Hace 12 min" },
    { id: 3, type: "payment", message: "Pago confirmado por $1,299", time: "Hace 25 min" },
    { id: 4, type: "shipping", message: "Pedido #ORD-008 enviado", time: "Hace 1 hora" },
    { id: 5, type: "order", message: "Pedido #ORD-007 entregado", time: "Hace 2 horas" },
  ])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setState(getInitialState())
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (mounted && state.settings.autoSave) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, mounted])

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const addActivity = useCallback((activity: Omit<Activity, "id" | "time">) => {
    setActivities((prev) => [
      { ...activity, id: Date.now(), time: "Ahora" },
      ...prev.slice(0, 4),
    ])
  }, [])

  const addProduct = useCallback((product: Product) => {
    setState((prev) => ({
      ...prev,
      products: [...prev.products, product],
      kpiData: { ...prev.kpiData, totalSales: prev.kpiData.totalSales + product.price },
    }))
    addActivity({ type: "product", message: `Producto "${product.name}" agregado` })
    showToast(`Producto "${product.name}" agregado correctamente`)
  }, [showToast, addActivity])

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }))
    showToast("Producto actualizado correctamente")
    addActivity({ type: "product", message: `Producto actualizado` })
  }, [showToast, addActivity])

  const deleteProduct = useCallback((id: string) => {
    const product = state.products.find((p) => p.id === id)
    setState((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }))
    showToast(`Producto "${product?.name}" eliminado`)
    addActivity({ type: "product", message: `Producto "${product?.name}" eliminado` })
  }, [state.products, showToast, addActivity])

  const updateOrderStatus = useCallback((id: string, status: Order["status"]) => {
    const statusLabels = { pending: "Pendiente", shipped: "Enviado", delivered: "Entregado" }
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === id ? { ...o, status } : o)),
      kpiData: {
        ...prev.kpiData,
        pendingOrders: prev.orders.filter((o) => 
          o.id === id ? status === "pending" : o.status === "pending"
        ).length,
      },
    }))
    showToast(`Pedido ${id} marcado como "${statusLabels[status]}"`)
    addActivity({ type: "shipping", message: `Pedido ${id} actualizado a ${statusLabels[status]}` })
  }, [showToast, addActivity])

  const setSelectedCategory = useCallback((category: string | null) => {
    setState((prev) => ({ ...prev, selectedCategory: category }))
    if (category) {
      showToast(`Filtrando por categoría: ${category}`, "info")
    }
  }, [showToast])

  const setOrderFilter = useCallback((filter: Order["status"] | "all") => {
    setState((prev) => ({ ...prev, orderFilter: filter }))
    const labels = { all: "Todos", pending: "Pendientes", shipped: "Enviados", delivered: "Entregados" }
    showToast(`Mostrando pedidos: ${labels[filter]}`, "info")
  }, [showToast])

  const updateSettings = useCallback((key: keyof DashboardState["settings"], value: string | boolean) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, [key]: value },
    }))
    showToast("Configuración guardada")
    addActivity({ type: "settings", message: `Configuración actualizada: ${key}` })
  }, [showToast, addActivity])

  return (
    <DashboardContext.Provider
      value={{
        ...state,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        setSelectedCategory,
        setOrderFilter,
        updateSettings,
        showToast,
        activities,
        addActivity,
      }}
    >
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-in slide-in-from-right fade-in duration-300 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm ${
              toast.type === "success"
                ? "border-success/30 bg-success/10 text-success"
                : toast.type === "error"
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : "border-primary/30 bg-primary/10 text-primary"
            }`}
          >
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        ))}
      </div>
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
