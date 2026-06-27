'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Producto = {
  id: string
  codigo: string
  nombre: string
  categoria: string
  stock: number
  minimo: number
  precio: number
  costo: number
  estado: 'ok' | 'bajo' | 'critico'
}

const STORAGE_KEY = 'lw_productos'

const initialProductos: Producto[] = [
  { id: '1', codigo: 'P001', nombre: 'Aceite Girasol 1L',      categoria: 'Alimentos', stock: 3,  minimo: 10, precio: 1850, costo: 1200, estado: 'critico' },
  { id: '2', codigo: 'P002', nombre: 'Harina 0000 1kg',         categoria: 'Alimentos', stock: 7,  minimo: 15, precio: 950,  costo: 650,  estado: 'bajo' },
  { id: '3', codigo: 'P003', nombre: 'Arroz Largo Fino 1kg',    categoria: 'Alimentos', stock: 45, minimo: 20, precio: 1200, costo: 850,  estado: 'ok' },
  { id: '4', codigo: 'P004', nombre: 'Azúcar Blanca 1kg',       categoria: 'Alimentos', stock: 32, minimo: 20, precio: 1100, costo: 750,  estado: 'ok' },
  { id: '5', codigo: 'P005', nombre: 'Papel A4 Resma 500h',     categoria: 'Librería',  stock: 2,  minimo: 5,  precio: 8500, costo: 6200, estado: 'critico' },
  { id: '6', codigo: 'P006', nombre: 'Detergente 750ml',        categoria: 'Limpieza',  stock: 18, minimo: 10, precio: 2200, costo: 1500, estado: 'ok' },
  { id: '7', codigo: 'P007', nombre: 'Yerba Mate 1kg',          categoria: 'Bebidas',   stock: 24, minimo: 15, precio: 3800, costo: 2800, estado: 'ok' },
  { id: '8', codigo: 'P008', nombre: 'Fideos Spaghetti 500g',   categoria: 'Alimentos', stock: 9,  minimo: 20, precio: 850,  costo: 580,  estado: 'bajo' },
]

export function calcularEstado(stock: number, minimo: number): Producto['estado'] {
  if (stock === 0 || stock <= minimo * 0.3) return 'critico'
  if (stock < minimo) return 'bajo'
  return 'ok'
}

type ProductosCtx = {
  productos: Producto[]
  agregar: (p: Omit<Producto, 'id' | 'estado'>) => void
  editar: (id: string, datos: Omit<Producto, 'id' | 'estado'>) => void
  eliminar: (id: string) => void
  ajustarStock: (id: string, cantidad: number) => void
}

const Ctx = createContext<ProductosCtx | null>(null)

export function ProductosProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>(() => {
    if (typeof window === 'undefined') return initialProductos
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : initialProductos
    } catch {
      return initialProductos
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productos))
  }, [productos])

  function recalcular(lista: Producto[]): Producto[] {
    return lista.map(p => ({ ...p, estado: calcularEstado(p.stock, p.minimo) }))
  }

  function agregar(datos: Omit<Producto, 'id' | 'estado'>) {
    setProductos(ps => recalcular([...ps, { ...datos, id: String(Date.now()), estado: 'ok' }]))
  }

  function editar(id: string, datos: Omit<Producto, 'id' | 'estado'>) {
    setProductos(ps => recalcular(ps.map(p => p.id === id ? { ...p, ...datos } : p)))
  }

  function eliminar(id: string) {
    setProductos(ps => ps.filter(p => p.id !== id))
  }

  function ajustarStock(id: string, cantidad: number) {
    setProductos(ps => recalcular(ps.map(p =>
      p.id === id ? { ...p, stock: Math.max(0, p.stock + cantidad) } : p
    )))
  }

  return <Ctx.Provider value={{ productos, agregar, editar, eliminar, ajustarStock }}>{children}</Ctx.Provider>
}

export function useProductos() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useProductos must be inside ProductosProvider')
  return ctx
}
