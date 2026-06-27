'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Rol = 'dueno' | 'encargado' | 'cajero' | 'vendedor'

export type EmpleadoSesion = {
  id: string
  nombre: string
  rol: Rol
  pin: string
  activo: boolean
  cargo: string
}

export const ROL_CONFIG: Record<Rol, {
  label: string
  color: string
  bg: string
  secciones: string[]
}> = {
  dueno: {
    label: 'Dueño',
    color: 'text-violet-700',
    bg: 'bg-violet-100',
    secciones: ['/', '/ventas', '/stock', '/compras', '/proveedores', '/empleados', '/caja', '/clientes', '/ofertas', '/publicidad', '/precios', '/sucursales', '/reportes', '/configuracion', '/productos'],
  },
  encargado: {
    label: 'Encargado',
    color: 'text-indigo-700',
    bg: 'bg-indigo-100',
    secciones: ['/ventas', '/stock', '/compras', '/proveedores', '/empleados', '/caja', '/clientes', '/ofertas', '/publicidad', '/precios', '/productos'],
  },
  cajero: {
    label: 'Cajero',
    color: 'text-emerald-700',
    bg: 'bg-emerald-100',
    secciones: ['/ventas', '/caja', '/clientes'],
  },
  vendedor: {
    label: 'Vendedor',
    color: 'text-amber-700',
    bg: 'bg-amber-100',
    secciones: ['/ventas', '/clientes'],
  },
}

export const EMPLEADOS_INICIAL: EmpleadoSesion[] = [
  { id: '1', nombre: 'Admin', rol: 'dueno', pin: '1234', activo: true, cargo: 'Dueño' },
]

const STORAGE_KEY = 'lw_empleados'
const SESION_KEY = 'lw_sesion_actual'

type SesionCtx = {
  empleados: EmpleadoSesion[]
  sesionActual: EmpleadoSesion | null
  iniciarSesion: (empleadoId: string, pin: string) => boolean
  cerrarSesion: () => void
  agregarEmpleado: (e: Omit<EmpleadoSesion, 'id'>) => void
  editarEmpleado: (id: string, e: Omit<EmpleadoSesion, 'id'>) => void
  eliminarEmpleado: (id: string) => void
  puedeAcceder: (seccion: string) => boolean
}

const Ctx = createContext<SesionCtx | null>(null)

export function SesionProvider({ children }: { children: ReactNode }) {
  const [empleados, setEmpleados] = useState<EmpleadoSesion[]>(() => {
    if (typeof window === 'undefined') return EMPLEADOS_INICIAL
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '') } catch { return EMPLEADOS_INICIAL }
  })
  const [sesionActual, setSesionActual] = useState<EmpleadoSesion | null>(() => {
    if (typeof window === 'undefined') return null
    try { return JSON.parse(sessionStorage.getItem(SESION_KEY) ?? 'null') } catch { return null }
  })

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(empleados)) }, [empleados])
  useEffect(() => { sessionStorage.setItem(SESION_KEY, JSON.stringify(sesionActual)) }, [sesionActual])

  function iniciarSesion(empleadoId: string, pin: string): boolean {
    const emp = empleados.find(e => e.id === empleadoId && e.pin === pin && e.activo)
    if (!emp) return false
    setSesionActual(emp)
    return true
  }

  function cerrarSesion() { setSesionActual(null) }

  function agregarEmpleado(datos: Omit<EmpleadoSesion, 'id'>) {
    setEmpleados(es => [...es, { ...datos, id: String(Date.now()) }])
  }

  function editarEmpleado(id: string, datos: Omit<EmpleadoSesion, 'id'>) {
    setEmpleados(es => es.map(e => e.id === id ? { ...e, ...datos } : e))
    if (sesionActual?.id === id) setSesionActual(prev => prev ? { ...prev, ...datos } : null)
  }

  function eliminarEmpleado(id: string) {
    setEmpleados(es => es.filter(e => e.id !== id))
    if (sesionActual?.id === id) setSesionActual(null)
  }

  function puedeAcceder(seccion: string): boolean {
    if (!sesionActual) return false
    const cfg = ROL_CONFIG[sesionActual.rol]
    return cfg.secciones.some(s => seccion === s || seccion.startsWith(s + '/'))
  }

  return <Ctx.Provider value={{ empleados, sesionActual, iniciarSesion, cerrarSesion, agregarEmpleado, editarEmpleado, eliminarEmpleado, puedeAcceder }}>{children}</Ctx.Provider>
}

export function useSesion() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSesion must be inside SesionProvider')
  return ctx
}
