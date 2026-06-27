'use client'
import { useState } from 'react'
import { Package, Search, Plus, AlertTriangle, QrCode, Upload, Edit, Trash2, TrendingDown, X, Save, ArrowUpCircle, ArrowDownCircle, RefreshCw } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useProductos, calcularEstado, type Producto } from '@/lib/store/productos'

const estadoConfig = {
  ok:      { label: 'Normal',     class: 'bg-green-50 text-green-700' },
  bajo:    { label: 'Stock bajo', class: 'bg-amber-50 text-amber-700' },
  critico: { label: 'Crítico',    class: 'bg-red-50 text-red-700' },
}

const CATEGORIAS = ['Alimentos', 'Bebidas', 'Limpieza', 'Librería', 'Indumentaria', 'Electrónica', 'Ferretería', 'Otro']

type FormData = { codigo: string; nombre: string; categoria: string; stock: number; minimo: number; precio: number; costo: number }
const emptyForm: FormData = { codigo: '', nombre: '', categoria: 'Alimentos', stock: 0, minimo: 0, precio: 0, costo: 0 }

function ModalProducto({ titulo, form, onChange, onGuardar, onCerrar, modoIngreso, setModoIngreso }: {
  titulo: string; form: FormData; onChange: (f: FormData) => void
  onGuardar: () => void; onCerrar: () => void
  modoIngreso: 'manual' | 'barcode' | 'imagen'; setModoIngreso: (m: 'manual' | 'barcode' | 'imagen') => void
}) {
  function set(field: keyof FormData, value: string | number) { onChange({ ...form, [field]: value }) }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">{titulo}</h2>
          <button onClick={onCerrar} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            {[{ id: 'manual', icon: Package, label: 'Manual' }, { id: 'barcode', icon: QrCode, label: 'Código barras' }, { id: 'imagen', icon: Upload, label: 'Por imagen' }].map(m => (
              <button key={m.id} onClick={() => setModoIngreso(m.id as typeof modoIngreso)}
                className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${modoIngreso === m.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                <m.icon className="w-5 h-5" />{m.label}
              </button>
            ))}
          </div>
          {modoIngreso === 'barcode' && (
            <div className="p-4 bg-slate-900 rounded-xl text-center">
              <QrCode className="w-14 h-14 text-white mx-auto mb-2" />
              <p className="text-slate-400 text-sm mb-2">Escaneá el código con la cámara</p>
              <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg font-semibold">Activar cámara</button>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Código interno</label>
              <input value={form.codigo} onChange={e => set('codigo', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="P001" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Categoría</label>
              <select value={form.categoria} onChange={e => set('categoria', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre del producto</label>
            <input value={form.nombre} onChange={e => set('nombre', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ej: Aceite Girasol 1L" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Stock actual</label>
              <input type="number" value={form.stock} onChange={e => set('stock', Number(e.target.value))} min={0} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Stock mínimo</label>
              <input type="number" value={form.minimo} onChange={e => set('minimo', Number(e.target.value))} min={0} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Precio de costo</label>
              <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input type="number" value={form.costo} onChange={e => set('costo', Number(e.target.value))} min={0} className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Precio de venta</label>
              <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input type="number" value={form.precio} onChange={e => set('precio', Number(e.target.value))} min={0} className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          </div>
          {form.costo > 0 && form.precio > 0 && (
            <div className="bg-indigo-50 rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm text-indigo-700">Margen estimado</span>
              <span className="font-bold text-indigo-700">
                {(((form.precio - form.costo) / form.costo) * 100).toFixed(1)}%
                <span className="ml-2 font-normal text-indigo-500 text-xs">({formatCurrency(form.precio - form.costo)} por unidad)</span>
              </span>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-slate-100 flex gap-3">
          <button onClick={onCerrar} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancelar</button>
          <button onClick={onGuardar} disabled={!form.nombre || !form.codigo}
            className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Save className="w-4 h-4" /> Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

function ModalAjusteStock({ producto, onCerrar }: { producto: Producto; onCerrar: () => void }) {
  const { ajustarStock } = useProductos()
  const [tipo, setTipo] = useState<'entrada' | 'salida' | 'ajuste'>('entrada')
  const [cantidad, setCantidad] = useState(1)
  const [nota, setNota] = useState('')

  const nuevoStock = tipo === 'entrada'
    ? producto.stock + cantidad
    : tipo === 'salida'
    ? Math.max(0, producto.stock - cantidad)
    : cantidad

  function guardar() {
    if (tipo === 'entrada') ajustarStock(producto.id, cantidad)
    else if (tipo === 'salida') ajustarStock(producto.id, -cantidad)
    else ajustarStock(producto.id, cantidad - producto.stock)
    onCerrar()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Actualizar stock</h2>
            <p className="text-slate-500 text-sm truncate max-w-xs">{producto.nombre}</p>
          </div>
          <button onClick={onCerrar} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Stock actual */}
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-sm text-slate-500">Stock actual</span>
            <span className="text-3xl font-black text-slate-900">{producto.stock}</span>
          </div>

          {/* Tipo de movimiento */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Tipo de movimiento</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'entrada', icon: ArrowUpCircle, label: 'Entrada', color: 'text-green-600', active: 'border-green-500 bg-green-50' },
                { id: 'salida', icon: ArrowDownCircle, label: 'Salida', color: 'text-red-600', active: 'border-red-500 bg-red-50' },
                { id: 'ajuste', icon: RefreshCw, label: 'Ajuste', color: 'text-indigo-600', active: 'border-indigo-500 bg-indigo-50' },
              ].map(t => (
                <button key={t.id} onClick={() => { setTipo(t.id as typeof tipo); setCantidad(1) }}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${tipo === t.id ? t.active : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                  <t.icon className={`w-5 h-5 ${tipo === t.id ? t.color : 'text-slate-400'}`} />
                  {t.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              {tipo === 'entrada' && 'Suma al stock existente (recepción de mercadería)'}
              {tipo === 'salida' && 'Resta al stock existente (merma, rotura, uso)'}
              {tipo === 'ajuste' && 'Fija el stock al valor exacto (conteo físico)'}
            </p>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              {tipo === 'ajuste' ? 'Stock real contado' : 'Cantidad'}
            </label>
            <div className="flex items-center gap-3">
              <button onClick={() => setCantidad(c => Math.max(tipo === 'ajuste' ? 0 : 1, c - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-lg transition-colors">−</button>
              <input type="number" value={cantidad} onChange={e => setCantidad(Math.max(0, Number(e.target.value)))} min={0}
                className="flex-1 text-center text-2xl font-black py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button onClick={() => setCantidad(c => c + 1)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-lg transition-colors">+</button>
            </div>
          </div>

          {/* Nota */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nota (opcional)</label>
            <input value={nota} onChange={e => setNota(e.target.value)} placeholder="Ej: Recepción factura #123, merma por vencimiento..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          {/* Preview */}
          <div className={`rounded-2xl p-4 flex items-center justify-between ${nuevoStock < producto.stock ? 'bg-red-50' : nuevoStock > producto.stock ? 'bg-green-50' : 'bg-slate-50'}`}>
            <span className="text-sm font-semibold text-slate-600">Stock resultante</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm line-through">{producto.stock}</span>
              <span className="text-slate-400">→</span>
              <span className={`text-2xl font-black ${nuevoStock < producto.stock ? 'text-red-600' : nuevoStock > producto.stock ? 'text-green-600' : 'text-slate-600'}`}>
                {nuevoStock}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex gap-3">
          <button onClick={onCerrar} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancelar</button>
          <button onClick={guardar}
            className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Save className="w-4 h-4" /> Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StockPage() {
  const { productos, agregar, editar, eliminar } = useProductos()
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [showNuevo, setShowNuevo] = useState(false)
  const [formNuevo, setFormNuevo] = useState<FormData>(emptyForm)
  const [modoNuevo, setModoNuevo] = useState<'manual' | 'barcode' | 'imagen'>('manual')
  const [editando, setEditando] = useState<Producto | null>(null)
  const [formEdit, setFormEdit] = useState<FormData>(emptyForm)
  const [modoEdit, setModoEdit] = useState<'manual' | 'barcode' | 'imagen'>('manual')
  const [eliminando, setEliminando] = useState<Producto | null>(null)
  const [ajustando, setAjustando] = useState<Producto | null>(null)

  const filtrados = productos.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) || p.codigo.toLowerCase().includes(search.toLowerCase())
    const matchEstado = filtroEstado === 'todos' || p.estado === filtroEstado
    return matchSearch && matchEstado
  })

  function abrirEditar(p: Producto) {
    setEditando(p)
    setFormEdit({ codigo: p.codigo, nombre: p.nombre, categoria: p.categoria, stock: p.stock, minimo: p.minimo, precio: p.precio, costo: p.costo })
    setModoEdit('manual')
  }

  function guardarEdicion() {
    if (!editando) return
    editar(editando.id, formEdit)
    setEditando(null)
  }

  function guardarNuevo() {
    agregar(formNuevo)
    setFormNuevo(emptyForm)
    setShowNuevo(false)
  }

  function confirmarEliminar() {
    if (!eliminando) return
    eliminar(eliminando.id)
    setEliminando(null)
  }

  const criticos = productos.filter(p => p.estado === 'critico').length
  const bajos = productos.filter(p => p.estado === 'bajo').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Control de Stock</h1>
          <p className="text-slate-500 text-sm">{productos.length} productos registrados</p>
        </div>
        <button onClick={() => { setFormNuevo(emptyForm); setShowNuevo(true) }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
          <Plus className="w-4 h-4" /> Agregar producto
        </button>
      </div>

      {/* ALERTAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0" />
          <div><div className="font-black text-2xl text-red-600">{criticos}</div><div className="text-sm text-red-500">Productos críticos</div></div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <TrendingDown className="w-8 h-8 text-amber-500 flex-shrink-0" />
          <div><div className="font-black text-2xl text-amber-600">{bajos}</div><div className="text-sm text-amber-500">Stock bajo</div></div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <Package className="w-8 h-8 text-green-500 flex-shrink-0" />
          <div><div className="font-black text-2xl text-green-600">{productos.filter(p => p.estado === 'ok').length}</div><div className="text-sm text-green-500">En nivel normal</div></div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 px-3 py-2 bg-slate-100 rounded-xl">
          <Search className="w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o código..."
            className="bg-transparent flex-1 text-sm text-slate-700 outline-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[{ id: 'todos', label: 'Todos' }, { id: 'critico', label: 'Crítico' }, { id: 'bajo', label: 'Bajo' }, { id: 'ok', label: 'Normal' }].map(f => (
            <button key={f.id} onClick={() => setFiltroEstado(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filtroEstado === f.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Código', 'Producto', 'Categoría', 'Stock', 'Mínimo', 'Costo', 'Precio', 'Margen', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtrados.map(p => {
                const cfg = estadoConfig[p.estado]
                const margen = p.costo > 0 ? (((p.precio - p.costo) / p.costo) * 100).toFixed(0) : '-'
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-indigo-600 font-semibold">{p.codigo}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-900 whitespace-nowrap">{p.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{p.categoria}</td>
                    <td className="px-4 py-3 text-center font-black text-xl text-slate-900">{p.stock}</td>
                    <td className="px-4 py-3 text-center text-sm text-slate-400">{p.minimo}</td>
                    <td className="px-4 py-3 text-right text-sm text-slate-600">{formatCurrency(p.costo)}</td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">{formatCurrency(p.precio)}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-600">{margen !== '-' ? `${margen}%` : '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.class}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setAjustando(p)} title="Actualizar stock"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button onClick={() => abrirEditar(p)} title="Editar producto"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEliminando(p)} title="Eliminar"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showNuevo && (
        <ModalProducto titulo="Agregar producto" form={formNuevo} onChange={setFormNuevo}
          onGuardar={guardarNuevo} onCerrar={() => setShowNuevo(false)}
          modoIngreso={modoNuevo} setModoIngreso={setModoNuevo} />
      )}

      {editando && (
        <ModalProducto titulo={`Editar: ${editando.nombre}`} form={formEdit} onChange={setFormEdit}
          onGuardar={guardarEdicion} onCerrar={() => setEditando(null)}
          modoIngreso={modoEdit} setModoIngreso={setModoEdit} />
      )}

      {ajustando && <ModalAjusteStock producto={ajustando} onCerrar={() => setAjustando(null)} />}

      {eliminando && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="font-black text-slate-900 text-lg mb-2">¿Eliminar producto?</h3>
            <p className="text-slate-500 text-sm mb-6">Vas a eliminar <strong>{eliminando.nombre}</strong>. Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setEliminando(null)} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancelar</button>
              <button onClick={confirmarEliminar} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
