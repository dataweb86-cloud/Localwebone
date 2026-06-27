'use client'
import { useState } from 'react'
import { User, Search, Plus, Phone, Mail, ShoppingBag, TrendingUp } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

const clientes = [
  { id: '1', nombre: 'Juan López', email: 'juan@mail.com', telefono: '1145678901', compras: 14, totalGastado: 87500, ultimaCompra: '2026-06-24' },
  { id: '2', nombre: 'María Pérez', email: 'maria@mail.com', telefono: '1156789012', compras: 28, totalGastado: 245000, ultimaCompra: '2026-06-25' },
  { id: '3', nombre: 'Carlos Gómez', email: 'carlos@mail.com', telefono: '1167890123', compras: 7, totalGastado: 32000, ultimaCompra: '2026-06-20' },
  { id: '4', nombre: 'Ana Torres', email: 'ana@mail.com', telefono: '1178901234', compras: 42, totalGastado: 580000, ultimaCompra: '2026-06-26' },
  { id: '5', nombre: 'Pedro Ríos', email: 'pedro@mail.com', telefono: '1189012345', compras: 3, totalGastado: 12500, ultimaCompra: '2026-06-10' },
]

function Categoria({ gasto }: { gasto: number }) {
  if (gasto >= 200000) return <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">⭐ VIP</span>
  if (gasto >= 50000) return <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">💎 Frecuente</span>
  return <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Nuevo</span>
}

export default function ClientesPage() {
  const [search, setSearch] = useState('')

  const filtrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Cartera de Clientes</h1>
          <p className="text-slate-500 text-sm">{clientes.length} clientes registrados</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all" style={{ background: '#6366f1' }}>
          <Plus className="w-4 h-4" /> Agregar cliente
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <div className="text-2xl font-black text-amber-600">{clientes.filter(c => c.totalGastado >= 200000).length}</div>
          <div className="text-sm text-amber-500">⭐ Clientes VIP</div>
        </div>
        <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
          <div className="text-2xl font-black text-indigo-600">{clientes.filter(c => c.totalGastado >= 50000 && c.totalGastado < 200000).length}</div>
          <div className="text-sm text-indigo-500">💎 Frecuentes</div>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="text-2xl font-black text-slate-600">{clientes.filter(c => c.totalGastado < 50000).length}</div>
          <div className="text-sm text-slate-500">Nuevos</div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <Search className="w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar cliente..." className="flex-1 text-sm text-slate-700 outline-none bg-transparent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtrados.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {c.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 truncate">{c.nombre}</div>
                <Categoria gasto={c.totalGastado} />
              </div>
            </div>
            <div className="space-y-1.5 text-sm text-slate-500 mb-4">
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /><span className="truncate">{c.email}</span></div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{c.telefono}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
              <div className="text-center">
                <div className="font-black text-slate-900">{c.compras}</div>
                <div className="text-xs text-slate-400">compras</div>
              </div>
              <div className="text-center">
                <div className="font-black text-slate-900 text-sm">{formatCurrency(c.totalGastado)}</div>
                <div className="text-xs text-slate-400">total gastado</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
