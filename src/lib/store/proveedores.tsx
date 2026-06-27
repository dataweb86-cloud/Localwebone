'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Proveedor = {
  id: string
  nombre: string
  razonSocial: string
  cuit: string
  email: string
  telefono: string
  celular: string
  direccion: string
  ciudad: string
  provincia: string
  contacto: string      // nombre del contacto
  categoria: string     // rubro
  condicionIva: string
  notas: string
  activo: boolean
  fechaAlta: string
}

const STORAGE_KEY = 'lw_proveedores'

type ProveedoresCtx = {
  proveedores: Proveedor[]
  agregar: (p: Omit<Proveedor, 'id' | 'fechaAlta' | 'activo'>) => void
  editar: (id: string, p: Omit<Proveedor, 'id' | 'fechaAlta' | 'activo'>) => void
  eliminar: (id: string) => void
  toggleActivo: (id: string) => void
}

const Ctx = createContext<ProveedoresCtx | null>(null)

export function ProveedoresProvider({ children }: { children: ReactNode }) {
  const [proveedores, setProveedores] = useState<Proveedor[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(proveedores))
  }, [proveedores])

  function agregar(datos: Omit<Proveedor, 'id' | 'fechaAlta' | 'activo'>) {
    setProveedores(ps => [...ps, { ...datos, id: String(Date.now()), fechaAlta: new Date().toISOString().split('T')[0], activo: true }])
  }

  function editar(id: string, datos: Omit<Proveedor, 'id' | 'fechaAlta' | 'activo'>) {
    setProveedores(ps => ps.map(p => p.id === id ? { ...p, ...datos } : p))
  }

  function eliminar(id: string) {
    setProveedores(ps => ps.filter(p => p.id !== id))
  }

  function toggleActivo(id: string) {
    setProveedores(ps => ps.map(p => p.id === id ? { ...p, activo: !p.activo } : p))
  }

  return <Ctx.Provider value={{ proveedores, agregar, editar, eliminar, toggleActivo }}>{children}</Ctx.Provider>
}

export function useProveedores() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useProveedores must be inside ProveedoresProvider')
  return ctx
}
