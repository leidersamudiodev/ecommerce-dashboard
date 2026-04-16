"use client"

import { useState } from "react"
import { categories, type Product } from "@/lib/mock-data"
import { useDashboard } from "@/lib/dashboard-context"
import { cn } from "@/lib/utils"
import { Search, Edit2, Trash2, Filter, Eye, Plus, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"

export function ProductsTable() {
  const { products, selectedCategory, setSelectedCategory, deleteProduct, updateProduct, addProduct, showToast } = useDashboard()
  const [searchTerm, setSearchTerm] = useState("")
  const [localCategory, setLocalCategory] = useState("Todas")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "Electrónica",
  })

  // Use global selectedCategory if set, otherwise use local filter
  const activeCategory = selectedCategory || localCategory

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory =
      activeCategory === "Todas" || product.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id: string) => {
    setIsLoading(id)
    await new Promise(resolve => setTimeout(resolve, 400))
    deleteProduct(id)
    setIsLoading(null)
    setShowDeleteConfirm(null)
  }

  const handleEdit = async (product: Product) => {
    if (!editingProduct) return
    setIsLoading(product.id)
    await new Promise(resolve => setTimeout(resolve, 400))
    updateProduct(product.id, {
      name: editingProduct.name,
      price: editingProduct.price,
      stock: editingProduct.stock,
      status: editingProduct.stock === 0 ? "inactive" : editingProduct.stock < 5 ? "low_stock" : "active",
    })
    setIsLoading(null)
    setEditingProduct(null)
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      showToast("Por favor completa todos los campos", "error")
      return
    }
    setIsLoading("add")
    await new Promise(resolve => setTimeout(resolve, 400))
    const stock = parseInt(newProduct.stock)
    addProduct({
      id: `${Date.now()}`,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock,
      status: stock === 0 ? "inactive" : stock < 5 ? "low_stock" : "active",
      category: newProduct.category,
      image: "/placeholder.svg",
    })
    setNewProduct({ name: "", price: "", stock: "", category: "Electrónica" })
    setShowAddModal(false)
    setIsLoading(null)
  }

  const handleCategoryChange = (cat: string) => {
    setLocalCategory(cat)
    if (selectedCategory) {
      setSelectedCategory(null)
    }
  }

  const getStatusBadge = (status: Product["status"]) => {
    const styles = {
      active: "bg-success/15 text-success border-success/25",
      inactive: "bg-muted/50 text-muted-foreground border-border",
      low_stock: "bg-warning/15 text-warning border-warning/25",
    }
    const labels = {
      active: "Activo",
      inactive: "Inactivo",
      low_stock: "Stock bajo",
    }
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
          styles[status]
        )}
      >
        {labels[status]}
      </span>
    )
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm shadow-premium">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Gestión de Productos
            </h3>
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} productos encontrados
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="ml-2 inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <X className="h-3 w-3" />
                  Limpiar filtro
                </button>
              )}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Add Product Button */}
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar
            </Button>

            {/* Search */}
            <div className="flex items-center gap-2 rounded-xl bg-secondary/50 border border-border px-3 py-2 transition-all focus-within:border-primary/30 focus-within:bg-secondary">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none sm:w-48"
              />
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={activeCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="rounded-xl bg-secondary/50 border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/30 transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-card text-foreground">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Producto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Precio
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Stock
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
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className={cn(
                    "group transition-colors hover:bg-secondary/20",
                    isLoading === product.id && "opacity-50"
                  )}
                >
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-secondary/50 border border-border">
                        <span className="text-xs font-medium text-muted-foreground">
                          {product.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-card-foreground">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <button
                      onClick={() => setSelectedCategory(product.category)}
                      className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                    >
                      {product.category}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-primary">
                    ${product.price.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                    {product.stock} unidades
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => setEditingProduct({ ...product })}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setShowDeleteConfirm(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No se encontraron productos</p>
          </div>
        )}
      </div>

      {/* View Product Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name || ""}
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-secondary/30 p-3">
                <p className="text-xs text-muted-foreground">Precio</p>
                <p className="text-xl font-bold text-primary">${selectedProduct.price.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-secondary/30 p-3">
                <p className="text-xs text-muted-foreground">Stock</p>
                <p className="text-xl font-bold text-foreground">{selectedProduct.stock}</p>
              </div>
              <div className="rounded-lg bg-secondary/30 p-3">
                <p className="text-xs text-muted-foreground">Categoría</p>
                <p className="font-medium text-foreground">{selectedProduct.category}</p>
              </div>
              <div className="rounded-lg bg-secondary/30 p-3">
                <p className="text-xs text-muted-foreground">Estado</p>
                {getStatusBadge(selectedProduct.status)}
              </div>
            </div>
            <Button variant="outline" onClick={() => setSelectedProduct(null)} className="w-full">
              Cerrar
            </Button>
          </div>
        )}
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title="Editar Producto"
      >
        {editingProduct && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nombre</label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="mt-1 w-full rounded-lg bg-secondary border border-border px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Precio</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                  className="mt-1 w-full rounded-lg bg-secondary border border-border px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Stock</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                  className="mt-1 w-full rounded-lg bg-secondary border border-border px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => handleEdit(editingProduct)}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading === editingProduct.id}
              >
                {isLoading === editingProduct.id ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Guardar
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setEditingProduct(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Agregar Producto"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Nombre</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="Nombre del producto"
              className="mt-1 w-full rounded-lg bg-secondary border border-border px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Precio</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="0.00"
                className="mt-1 w-full rounded-lg bg-secondary border border-border px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Stock</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                placeholder="0"
                className="mt-1 w-full rounded-lg bg-secondary border border-border px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Categoría</label>
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="mt-1 w-full rounded-lg bg-secondary border border-border px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50"
            >
              {categories.filter(c => c !== "Todas").map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleAddProduct}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading === "add"}
            >
              {isLoading === "add" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Producto
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={!!isLoading}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
