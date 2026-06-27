'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ProductosProvider } from '@/lib/store/productos'
import { ProveedoresProvider } from '@/lib/store/proveedores'
import { SesionProvider, useSesion, ROL_CONFIG } from '@/lib/store/sesion'
import { ComercioProvider } from '@/lib/store/comercio'
import PantallaPIN from '@/app/dashboard/components/PantallaPIN'
import {
  Store, BarChart3, Package, Users, ShoppingCart, Megaphone,
  TrendingUp, Building2, Receipt, Boxes, Settings, Bell,
  Menu, X, ChevronDown, LogOut, User, Search, ContactRound, Truck, Tag
} from 'lucide-react'

const navItems = [
  { href: '/dashboard',              icon: BarChart3,     label: 'Dashboard',     seccion: '/',              exact: true },
  { href: '/dashboard/ventas',       icon: ShoppingCart,  label: 'Ventas / POS',  seccion: '/ventas' },
  { href: '/dashboard/stock',        icon: Package,       label: 'Stock',         seccion: '/stock' },
  { href: '/dashboard/compras',      icon: Truck,         label: 'Compras',       seccion: '/compras' },
  { href: '/dashboard/proveedores',  icon: ContactRound,  label: 'Proveedores',   seccion: '/proveedores' },
  { href: '/dashboard/productos',    icon: Boxes,         label: 'Productos',     seccion: '/productos' },
  { href: '/dashboard/empleados',    icon: Users,         label: 'Empleados',     seccion: '/empleados' },
  { href: '/dashboard/caja',         icon: Receipt,       label: 'Caja Diaria',   seccion: '/caja' },
  { href: '/dashboard/clientes',     icon: User,          label: 'Clientes',      seccion: '/clientes' },
  { href: '/dashboard/ofertas',       icon: Tag,           label: 'Ofertas',       seccion: '/ofertas' },
  { href: '/dashboard/publicidad',   icon: Megaphone,     label: 'Publicidad',    seccion: '/publicidad' },
  { href: '/dashboard/precios',      icon: TrendingUp,    label: 'Precios',       seccion: '/precios' },
  { href: '/dashboard/sucursales',   icon: Building2,     label: 'Sucursales',    seccion: '/sucursales' },
  { href: '/dashboard/reportes',     icon: BarChart3,     label: 'Reportes',      seccion: '/reportes' },
  { href: '/dashboard/configuracion',icon: Settings,      label: 'Configuración', seccion: '/configuracion' },
]

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const { sesionActual, cerrarSesion, puedeAcceder } = useSesion()

  const itemsVisibles = navItems.filter(item => puedeAcceder(item.seccion))

  function isActive(item: typeof navItems[0]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--sidebar-bg)' }}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-600">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold">LocalWeb <span className="text-indigo-400">One</span></span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-3 py-3 border-b border-white/10">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-left">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <Store className="w-4 h-4 text-indigo-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold truncate">Mi Comercio</div>
              <div className="text-slate-500 text-xs">Plan Profesional</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {itemsVisibles.map(item => {
            const active = isActive(item)
            return (
              <Link key={item.href} href={item.href} onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          {sesionActual && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${ROL_CONFIG[sesionActual.rol].bg}`}>
                <span className={`text-xs font-black ${ROL_CONFIG[sesionActual.rol].color}`}>{sesionActual.nombre[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-semibold truncate">{sesionActual.nombre}</div>
                <div className={`text-xs font-medium truncate ${ROL_CONFIG[sesionActual.rol].color}`}>{ROL_CONFIG[sesionActual.rol].label}</div>
              </div>
              <button onClick={cerrarSesion} title="Cerrar sesión" className="text-slate-500 hover:text-red-400 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

function DashboardInner({ children }: { children: React.ReactNode }) {
  const { sesionActual, cerrarSesion } = useSesion()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null
  if (!sesionActual) return <PantallaPIN />

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl w-64">
              <Search className="w-4 h-4 text-slate-400" />
              <input placeholder="Buscar productos, ventas..." className="bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none flex-1" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            {sesionActual && (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${ROL_CONFIG[sesionActual.rol].bg}`}>
                  <span className={`text-sm font-black ${ROL_CONFIG[sesionActual.rol].color}`}>{sesionActual.nombre[0]}</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold text-slate-800 leading-tight">{sesionActual.nombre}</div>
                  <div className={`text-xs font-medium ${ROL_CONFIG[sesionActual.rol].color}`}>{ROL_CONFIG[sesionActual.rol].label}</div>
                </div>
                <button onClick={cerrarSesion} title="Cambiar usuario" className="ml-1 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProductosProvider>
      <ProveedoresProvider>
        <ComercioProvider>
          <SesionProvider>
            <DashboardInner>{children}</DashboardInner>
          </SesionProvider>
        </ComercioProvider>
      </ProveedoresProvider>
    </ProductosProvider>
  )
}
