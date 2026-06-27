'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type PerfilComercio = {
  nombre: string
  slug: string          // url amigable ej: "mi-almacen"
  descripcion: string
  telefono: string
  celular: string
  whatsapp: string
  direccion: string
  ciudad: string
  horarios: string
  logoUrl: string       // base64 o url
  colorPrimario: string // hex
  instagram: string
  facebook: string
  plan: 'basico' | 'profesional' | 'enterprise'
}

export type ProductoOferta = {
  productoId: string
  nombre: string
  descripcion: string
  precioOriginal: number
  precioOferta: number
  imagen: string        // base64 o url
  activo: boolean
  destacado: boolean
  orden: number
}

const STORAGE_PERFIL = 'lw_perfil_comercio'
const STORAGE_OFERTAS = 'lw_ofertas'

const perfilInicial: PerfilComercio = {
  nombre: 'Mi Comercio',
  slug: 'mi-comercio',
  descripcion: 'Las mejores ofertas de la zona',
  telefono: '',
  celular: '',
  whatsapp: '',
  direccion: '',
  ciudad: '',
  horarios: 'Lun-Vie 9:00-20:00 / Sáb 9:00-14:00',
  logoUrl: '',
  colorPrimario: '#6366f1',
  instagram: '',
  facebook: '',
  plan: 'profesional',
}

type ComercioCtx = {
  perfil: PerfilComercio
  ofertas: ProductoOferta[]
  setPerfil: (p: PerfilComercio) => void
  agregarOferta: (o: Omit<ProductoOferta, 'orden'>) => void
  editarOferta: (productoId: string, o: Partial<ProductoOferta>) => void
  eliminarOferta: (productoId: string) => void
  toggleOferta: (productoId: string) => void
}

const Ctx = createContext<ComercioCtx | null>(null)

export function ComercioProvider({ children }: { children: ReactNode }) {
  const [perfil, setPerfil_] = useState<PerfilComercio>(() => {
    if (typeof window === 'undefined') return perfilInicial
    try { return { ...perfilInicial, ...JSON.parse(localStorage.getItem(STORAGE_PERFIL) ?? '{}') } } catch { return perfilInicial }
  })
  const [ofertas, setOfertas] = useState<ProductoOferta[]>(() => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem(STORAGE_OFERTAS) ?? '[]') } catch { return [] }
  })

  useEffect(() => { localStorage.setItem(STORAGE_PERFIL, JSON.stringify(perfil)) }, [perfil])
  useEffect(() => { localStorage.setItem(STORAGE_OFERTAS, JSON.stringify(ofertas)) }, [ofertas])

  function setPerfil(p: PerfilComercio) { setPerfil_(p) }

  function agregarOferta(o: Omit<ProductoOferta, 'orden'>) {
    setOfertas(os => [...os, { ...o, orden: os.length }])
  }

  function editarOferta(productoId: string, cambios: Partial<ProductoOferta>) {
    setOfertas(os => os.map(o => o.productoId === productoId ? { ...o, ...cambios } : o))
  }

  function eliminarOferta(productoId: string) {
    setOfertas(os => os.filter(o => o.productoId !== productoId))
  }

  function toggleOferta(productoId: string) {
    setOfertas(os => os.map(o => o.productoId === productoId ? { ...o, activo: !o.activo } : o))
  }

  return <Ctx.Provider value={{ perfil, ofertas, setPerfil, agregarOferta, editarOferta, eliminarOferta, toggleOferta }}>{children}</Ctx.Provider>
}

export function useComercio() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useComercio must be inside ComercioProvider')
  return ctx
}
