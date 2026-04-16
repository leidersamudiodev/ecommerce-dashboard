"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useDashboard } from "@/lib/dashboard-context"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Palette,
  Check,
  AlertTriangle,
} from "lucide-react"

export default function SettingsPage() {
  const { settings, updateSettings, showToast } = useDashboard()
  const [showDangerModal, setShowDangerModal] = useState<"deactivate" | "delete" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "admin@shop.com",
    phone: "+1 234 567 890",
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    showToast("Perfil actualizado correctamente")
    setIsLoading(false)
  }

  const handleDangerAction = async (action: "deactivate" | "delete") => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    showToast(
      action === "deactivate" 
        ? "Cuenta desactivada (simulado)" 
        : "Cuenta eliminada (simulado)",
      "info"
    )
    setIsLoading(false)
    setShowDangerModal(null)
  }

  const settingsSections = [
    {
      title: "Perfil",
      description: "Gestiona tu información personal y preferencias",
      icon: User,
      onClick: () => {
        document.getElementById("profile-section")?.scrollIntoView({ behavior: "smooth" })
      },
    },
    {
      title: "Notificaciones",
      description: "Configura cómo y cuándo recibir alertas",
      icon: Bell,
      toggle: {
        key: "notifications" as const,
        value: settings.notifications,
      },
    },
    {
      title: "Seguridad",
      description: "Contraseña, autenticación y dispositivos",
      icon: Shield,
      onClick: () => showToast("Sección de seguridad (próximamente)", "info"),
    },
    {
      title: "Facturación",
      description: "Métodos de pago y historial de facturas",
      icon: CreditCard,
      onClick: () => showToast("Sección de facturación (próximamente)", "info"),
    },
    {
      title: "Idioma y Región",
      description: "Zona horaria, formato de fecha y moneda",
      icon: Globe,
      onClick: () => showToast("Configuración regional (próximamente)", "info"),
    },
    {
      title: "Apariencia",
      description: "Tema, colores y personalización visual",
      icon: Palette,
      toggle: {
        key: "darkMode" as const,
        value: settings.darkMode,
      },
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            Configuración
          </h1>
          <p className="text-muted-foreground">
            Gestiona las preferencias de tu cuenta y tienda
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {settingsSections.map((section) => (
            <div
              key={section.title}
              onClick={section.toggle ? undefined : section.onClick}
              className={`group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,200,255,0.1)] ${
                !section.toggle ? "cursor-pointer" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_20px_rgba(0,200,255,0.4)]">
                  <section.icon className="h-6 w-6" />
                </div>
                {section.toggle && (
                  <button
                    onClick={() => updateSettings(section.toggle!.key, !section.toggle!.value)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      section.toggle.value ? "bg-primary" : "bg-secondary"
                    }`}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                        section.toggle.value ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                )}
              </div>
              <h3 className="mb-1 text-lg font-semibold text-card-foreground">
                {section.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Settings */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground">
            Preferencias Adicionales
          </h3>
          <div className="space-y-4">
            {[
              { key: "emailAlerts" as const, label: "Alertas por Email", description: "Recibir notificaciones importantes por correo" },
              { key: "soundEffects" as const, label: "Efectos de Sonido", description: "Reproducir sonidos en notificaciones" },
              { key: "autoSave" as const, label: "Guardado Automático", description: "Guardar cambios automáticamente en localStorage" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded-lg bg-secondary/30 p-4">
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <button
                  onClick={() => updateSettings(item.key, !settings[item.key])}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    settings[item.key] ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      settings[item.key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Account Section */}
        <div id="profile-section" className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground">
            Información de la Cuenta
          </h3>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-lg bg-secondary border border-border px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded-lg bg-secondary border border-border px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg bg-secondary border border-border px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Zona horaria
                </label>
                <select 
                  value={settings.timezone}
                  onChange={(e) => updateSettings("timezone", e.target.value)}
                  className="mt-1 w-full rounded-lg bg-secondary border border-border px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                >
                  <option value="America/Mexico_City">America/Mexico_City (GMT-6)</option>
                  <option value="America/New_York">America/New_York (GMT-5)</option>
                  <option value="Europe/Madrid">Europe/Madrid (GMT+1)</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button 
              variant="outline"
              onClick={() => setFormData({ name: "John Doe", email: "admin@shop.com", phone: "+1 234 567 890" })}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,200,255,0.3)] transition-all hover:shadow-[0_0_30px_rgba(0,200,255,0.5)]"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Guardar Cambios
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-destructive/30 bg-card p-6">
          <h3 className="mb-2 text-lg font-semibold text-destructive">
            Zona de Peligro
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Estas acciones son permanentes y no se pueden deshacer.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
              onClick={() => setShowDangerModal("deactivate")}
            >
              Desactivar Cuenta
            </Button>
            <Button 
              variant="outline" 
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
              onClick={() => setShowDangerModal("delete")}
            >
              Eliminar Cuenta
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Action Modal */}
      <Modal
        isOpen={!!showDangerModal}
        onClose={() => setShowDangerModal(null)}
        title={showDangerModal === "deactivate" ? "Desactivar Cuenta" : "Eliminar Cuenta"}
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-destructive/10 border border-destructive/30 p-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">
              {showDangerModal === "deactivate"
                ? "Tu cuenta será desactivada y no podrás acceder hasta reactivarla."
                : "Tu cuenta y todos los datos asociados serán eliminados permanentemente."}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => showDangerModal && handleDangerAction(showDangerModal)}
              disabled={isLoading}
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                showDangerModal === "deactivate" ? "Desactivar" : "Eliminar"
              )}
            </Button>
            <Button variant="outline" onClick={() => setShowDangerModal(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
