'use client'
import { useState } from 'react'
import { TrendingUp, RefreshCw, Search, CheckSquare, Square, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const productos = [
  { id: '1', codigo: 'P001', nombre: 'Aceite Girasol 1L', categoria: 'Alimentos', costo: 1200, precio: 1850, margen: 54.2 },
  { id: '2', codigo: 'P002', nombre: 'Harina 0000 1kg', categoria: 'Alimentos', costo: 650, precio: 950, margen: 46.2 },
  { id: '3', codigo: 'P003', nombre: 'Arroz Largo Fino 1kg', categoria: 'Alimentos', costo: 850, precio: 1200, margen: 41.2 },
  { id: '4', codigo: 'P004', nombre: 'Azúcar Blanca 1kg', categoria: 'Alimentos', costo: 750, precio: 1100, margen: 46.7 },
  { id: '5', codigo: 'P006', nombre: 'Detergente 750ml', categoria: 'Limpieza', costo: 1500, precio: 2200, margen: 46.7 },
  { id: '6', codigo: 'P007', nombre: 'Yerba Mate 1kg', categoria: 'Bebidas', costo: 2800, precio: 3800, margen: 35.7 },
]

export default function PreciosPage() {
  const [search, setSearch] = useState('')
  const [seleccionados, setSeleccionados] = useState<string[]>([])
  const [porcentaje, setPorcentaje] = useState('')
  const [modo, setModo] = useState<'subir' | 'bajar'>('subir')
  const [aplicado, setAplicado] = useState(false)

  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) || p.categoria.toLowerCase().includes(search.toLowerCase())
  )

  function toggleSeleccion(id: string) {
    setSeleccionados(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id])
  }

  function toggleTodos() {
    setSeleccionados(s => s.length === filtrados.length ? [] : filtrados.map(p => p.id))
  }

  function aplicarCambio() {
    if (!porcentaje || seleccionados.length === 0) return
    setAplicado(true)
    setTimeout(() => setAplicado(false), 3000)
  }

  function precioNuevo(precio: number) {
    if (!porcentaje) return precio
    const pct = Number(porcentaje)
    return modo === 'subir' ? precio * (1 + pct / 100) : precio * (1 - pct / 100)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Control de Precios</h1>
        <p className="text-slate-500 text-sm">Actualizá precios de forma individual o masiva</p>
      </div>

      {/* PANEL ACTUALIZACIÓN MASIVA */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-indigo-500" /> Actualización masiva de precios
        </h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            <button onClick={() => setModo('subir')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${modo === 'subir' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500'}`}>
              ↑ Subir
            </button>
            <button onClick={() => setModo('bajar')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${modo === 'bajar' ? 'bg-white text-red-500 shadow-sm' : 'text-slate-500'}`}>
              ↓ Bajar
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input type="number" value={porcentaje} onChange={e => setPorcentaje(e.target.value)}
              className="w-24 px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0" min={0} max={100} />
            <span className="text-lg font-bold text-slate-400">%</span>
          </div>
          <div className="text-sm text-slate-500">
            {seleccionados.length === 0 ? 'Seleccioná productos abajo' : `${seleccionados.length} producto${seleccionados.length > 1 ? 's' : ''} seleccionado${seleccionados.length > 1 ? 's' : ''}`}
          </div>
          <button onClick={aplicarCambio} disabled={!porcentaje || seleccionados.length === 0}
            className="px-6 py-2.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40 flex items-center gap-2"
            style={{ background: '#6366f1' }}>
            <RefreshCw className="w-4 h-4" /> Aplicar cambio
          </button>
        </div>
        {aplicado && (
          <div className="mt-3 flex items-center gap-2 text-green-600 text-sm font-semibold">
            <AlertCircle className="w-4 h-4" /> Precios actualizados correctamente
          </div>
        )}
      </div>

      {/* BÚSQUEDA */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <Search className="w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar producto o categoría..." className="flex-1 text-sm text-slate-700 outline-none bg-transparent" />
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-6 py-3 text-left">
                  <button onClick={toggleTodos} className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600">
                    {seleccionados.length === filtrados.length && filtrados.length > 0
                      ? <CheckSquare className="w-4 h-4 text-indigo-600" />
                      : <Square className="w-4 h-4" />
                    }
                    Seleccionar
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">Producto</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">Categoría</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">Costo</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">Precio actual</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">Precio nuevo</th>
                <th className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">Margen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtrados.map(p => {
                const sel = seleccionados.includes(p.id)
                const nuevo = precioNuevo(p.precio)
                const cambio = nuevo !== p.precio
                return (
                  <tr key={p.id} className={`transition-colors hover:bg-slate-50 ${sel ? 'bg-indigo-50/50' : ''}`}>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleSeleccion(p.id)}>
                        {sel ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5 text-slate-300" />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{p.nombre}</div>
                      <div className="text-xs text-slate-400 font-mono">{p.codigo}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{p.categoria}</td>
                    <td className="px-6 py-4 text-right text-sm text-slate-600">{formatCurrency(p.costo)}</td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">{formatCurrency(p.precio)}</td>
                    <td className="px-6 py-4 text-right">
                      {sel && cambio ? (
                        <span className={`text-sm font-bold ${modo === 'subir' ? 'text-green-600' : 'text-red-500'}`}>
                          {formatCurrency(nuevo)}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${p.margen >= 40 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                        {p.margen.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
