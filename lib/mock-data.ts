export const salesData = [
  { month: "Ene", sales: 4200, users: 2400 },
  { month: "Feb", sales: 3800, users: 2210 },
  { month: "Mar", sales: 5100, users: 2890 },
  { month: "Abr", sales: 4700, users: 2600 },
  { month: "May", sales: 5800, users: 3100 },
  { month: "Jun", sales: 6200, users: 3400 },
  { month: "Jul", sales: 5900, users: 3200 },
  { month: "Ago", sales: 7100, users: 3800 },
  { month: "Sep", sales: 6800, users: 3600 },
  { month: "Oct", sales: 7500, users: 4000 },
  { month: "Nov", sales: 8200, users: 4300 },
  { month: "Dic", sales: 9100, users: 4800 },
]

export const categoryData = [
  { name: "Electrónica", value: 35, fill: "var(--color-chart-1)" },
  { name: "Ropa", value: 25, fill: "var(--color-chart-2)" },
  { name: "Hogar", value: 20, fill: "var(--color-chart-3)" },
  { name: "Deportes", value: 12, fill: "var(--color-chart-4)" },
  { name: "Otros", value: 8, fill: "var(--color-chart-5)" },
]

export type Product = {
  id: string
  name: string
  price: number
  stock: number
  status: "active" | "inactive" | "low_stock"
  category: string
  image: string
}

export const products: Product[] = [
  { id: "1", name: "MacBook Pro 16\"", price: 2499, stock: 15, status: "active", category: "Electrónica", image: "/placeholder.svg" },
  { id: "2", name: "iPhone 15 Pro Max", price: 1199, stock: 42, status: "active", category: "Electrónica", image: "/placeholder.svg" },
  { id: "3", name: "AirPods Pro 2", price: 249, stock: 3, status: "low_stock", category: "Electrónica", image: "/placeholder.svg" },
  { id: "4", name: "Nike Air Max 90", price: 129, stock: 78, status: "active", category: "Deportes", image: "/placeholder.svg" },
  { id: "5", name: "Camiseta Premium", price: 45, stock: 0, status: "inactive", category: "Ropa", image: "/placeholder.svg" },
  { id: "6", name: "iPad Pro 12.9\"", price: 1099, stock: 23, status: "active", category: "Electrónica", image: "/placeholder.svg" },
  { id: "7", name: "Sofá Modular", price: 899, stock: 8, status: "active", category: "Hogar", image: "/placeholder.svg" },
  { id: "8", name: "Lámpara LED Smart", price: 79, stock: 56, status: "active", category: "Hogar", image: "/placeholder.svg" },
  { id: "9", name: "Zapatillas Running", price: 159, stock: 2, status: "low_stock", category: "Deportes", image: "/placeholder.svg" },
  { id: "10", name: "Vestido Elegante", price: 189, stock: 34, status: "active", category: "Ropa", image: "/placeholder.svg" },
  { id: "11", name: "Apple Watch Ultra", price: 799, stock: 18, status: "active", category: "Electrónica", image: "/placeholder.svg" },
  { id: "12", name: "Mesa de Centro", price: 299, stock: 12, status: "active", category: "Hogar", image: "/placeholder.svg" },
]

export type Order = {
  id: string
  customer: string
  email: string
  total: number
  status: "pending" | "shipped" | "delivered"
  date: string
  items: number
}

export const orders: Order[] = [
  { id: "ORD-001", customer: "María García", email: "maria@email.com", total: 2748, status: "delivered", date: "2024-01-15", items: 3 },
  { id: "ORD-002", customer: "Carlos López", email: "carlos@email.com", total: 1199, status: "shipped", date: "2024-01-14", items: 1 },
  { id: "ORD-003", customer: "Ana Martínez", email: "ana@email.com", total: 378, status: "pending", date: "2024-01-14", items: 2 },
  { id: "ORD-004", customer: "Pedro Sánchez", email: "pedro@email.com", total: 899, status: "delivered", date: "2024-01-13", items: 1 },
  { id: "ORD-005", customer: "Laura Fernández", email: "laura@email.com", total: 2298, status: "shipped", date: "2024-01-13", items: 4 },
  { id: "ORD-006", customer: "Miguel Torres", email: "miguel@email.com", total: 549, status: "pending", date: "2024-01-12", items: 2 },
  { id: "ORD-007", customer: "Sofia Ruiz", email: "sofia@email.com", total: 1548, status: "delivered", date: "2024-01-12", items: 3 },
  { id: "ORD-008", customer: "David González", email: "david@email.com", total: 799, status: "shipped", date: "2024-01-11", items: 1 },
  { id: "ORD-009", customer: "Elena Díaz", email: "elena@email.com", total: 428, status: "pending", date: "2024-01-11", items: 2 },
  { id: "ORD-010", customer: "Javier Moreno", email: "javier@email.com", total: 1897, status: "delivered", date: "2024-01-10", items: 5 },
]

export const kpiData = {
  totalSales: 74500,
  monthlyRevenue: 12847,
  pendingOrders: 23,
  activeUsers: 1284,
  salesGrowth: 12.5,
  revenueGrowth: 8.3,
  ordersGrowth: -5.2,
  usersGrowth: 15.7,
}

export const categories = ["Todas", "Electrónica", "Ropa", "Hogar", "Deportes", "Otros"]
