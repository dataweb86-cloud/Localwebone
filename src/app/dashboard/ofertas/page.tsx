'use client'
import { useState, useRef } from 'react'
import { Tag, Plus, X, Save, Eye, Share2, ToggleLeft, ToggleRight, Star, Trash2, ExternalLink, MessageCircle, Settings } from 'lucide-react'
import { useComercio, type ProductoOferta, type PerfilComercio } from '@/lib/store/comercio'
import { useProductos } from '@/lib/store/productos'
import { formatCurrency } from '@/lib/utils'

// ─── modal configuración del comercio ────────────────────────────────────────

function ModalPerfil({ perfil, onGuardar, onCerrar }: {
  perfil: PerfilComercio
  onGuardar: (p: PerfilComercio) => void
  onCerrar: () => void
}) {
  const [form, setForm] = useState(perfil)
  function set(k: keyof PerfilComercio, v: string) { setForm(f => ({ ...f, [k]: v })) }

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => set('logoUrl', ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-black text-slate-900">Configurar tienda pública</h2>
          <button onClick={onCerrar} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* logo */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 flex-shrink-0">
              {form.logoUrl
                ? <img src={form.logoUrl} alt="logo" className="w-full h-full object-contain" />
                : <span className="text-2xl font-black text-slate-300">{form.nombre[0]}</span>
              }
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Logo del comercio</label>
              <label className="cursor-pointer text-xs text-indigo-600 font-semibold hover:text-indigo-800">
                Subir imagen
                <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Nombre del comercio</label>
              <input value={form.nombre} onChange={e => set('nombre', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1">URL de la tienda (slug)</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-2.5 rounded-l-xl border border-r-0 border-slate-200 whitespace-nowrap">localweb.com.ar/tienda/</span>
                <input value={form.slug} onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  className="flex-1 px-3 py-2.5 rounded-r-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="mi-comercio" />
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Descripción / slogan</label>
              <input value={form.descripcion} onChange={e => set('descripcion', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Las mejores ofertas de la zona" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">WhatsApp</label>
              <input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="3415001234" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Ciudad</label>
              <input value={form.ciudad} onChange={e => set('ciudad', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Rosario" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Horarios</label>
              <input value={form.horarios} onChange={e => set('horarios', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Lun-Vie 9:00-20:00" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Instagram</label>
              <input value={form.instagram} onChange={e => set('instagram', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="@micomercio" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Color principal</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.colorPrimario} onChange={e => set('colorPrimario', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5" />
                <input value={form.colorPrimario} onChange={e => set('colorPrimario', e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-slate-100 flex gap-3 flex-shrink-0">
          <button onClick={onCerrar} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancelar</button>
          <button onClick={() => { onGuardar(form); onCerrar() }}
            className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Save className="w-4 h-4" /> Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── modal agregar/editar oferta ──────────────────────────────────────────────

function ModalOferta({ inicial, onGuardar, onCerrar }: {
  inicial: Partial<ProductoOferta> & { productoId: string; nombre: string; precioOriginal: number }
  onGuardar: (o: ProductoOferta) => void
  onCerrar: () => void
}) {
  const [form, setForm] = useState<ProductoOferta>({
    productoId: inicial.productoId,
    nombre: inicial.nombre,
    descripcion: inicial.descripcion ?? '',
    precioOriginal: inicial.precioOriginal,
    precioOferta: inicial.precioOferta ?? Math.round(inicial.precioOriginal * 0.85),
    imagen: inicial.imagen ?? '',
    activo: inicial.activo ?? true,
    destacado: inicial.destacado ?? false,
    orden: inicial.orden ?? 0,
  })

  const descuento = form.precioOriginal > 0
    ? Math.round((1 - form.precioOferta / form.precioOriginal) * 100)
    : 0

  function handleImagen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setForm(f => ({ ...f, imagen: ev.target?.result as string }))
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-black text-slate-900">Configurar oferta</h2>
          <button onClick={onCerrar} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="font-semibold text-slate-800 text-sm">{form.nombre}</div>

          {/* imagen */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Imagen del producto</label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center flex-shrink-0">
                {form.imagen
                  ? <img src={form.imagen} alt="" className="w-full h-full object-cover" />
                  : <span className="text-3xl">📦</span>
                }
              </div>
              <label className="flex-1 cursor-pointer py-2.5 rounded-xl border border-dashed border-indigo-300 text-indigo-500 text-xs font-semibold hover:bg-indigo-50 text-center transition-all">
                {form.imagen ? 'Cambiar imagen' : 'Subir imagen'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImagen} />
              </label>
            </div>
          </div>

          {/* descripción */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Descripción (opcional)</label>
            <textarea value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
              rows={2} placeholder="Detalle del producto, variantes, etc."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>

          {/* precios */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Precio original</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input type="number" value={form.precioOriginal} min={0}
                  onChange={e => setForm(f => ({ ...f, precioOriginal: Number(e.target.value) }))}
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Precio oferta</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input type="number" value={form.precioOferta} min={0}
                  onChange={e => setForm(f => ({ ...f, precioOferta: Number(e.target.value) }))}
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-red-300 bg-red-50 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 font-bold text-red-700" />
              </div>
            </div>
          </div>

          {descuento > 0 && (
            <div className="flex items-center justify-between bg-green-50 rounded-xl p-3">
              <span className="text-sm text-green-700 font-semibold">Descuento</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-green-600">{descuento}% OFF</span>
                <span className="text-xs text-green-500">Ahorrás {formatCurrency(form.precioOriginal - form.precioOferta)}</span>
              </div>
            </div>
          )}

          {/* opciones */}
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer flex-1 bg-slate-50 rounded-xl p-3">
              <input type="checkbox" checked={form.destacado} onChange={e => setForm(f => ({ ...f, destacado: e.target.checked }))}
                className="rounded w-4 h-4 accent-indigo-600" />
              <span className="text-sm font-semibold text-slate-700">⭐ Destacado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer flex-1 bg-slate-50 rounded-xl p-3">
              <input type="checkbox" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))}
                className="rounded w-4 h-4 accent-indigo-600" />
              <span className="text-sm font-semibold text-slate-700">Visible</span>
            </label>
          </div>
        </div>
        <div className="p-5 border-t border-slate-100 flex gap-3 flex-shrink-0">
          <button onClick={onCerrar} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancelar</button>
          <button onClick={() => { onGuardar(form); onCerrar() }}
            className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Save className="w-4 h-4" /> Publicar oferta
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── página principal ─────────────────────────────────────────────────────────

export default function OfertasPage() {
  const { perfil, ofertas, setPerfil, agregarOferta, editarOferta, eliminarOferta, toggleOferta } = useComercio()
  const { productos } = useProductos()
  const [showPerfil, setShowPerfil] = useState(false)
  const [modalOferta, setModalOferta] = useState<{ productoId: string; nombre: string; precioOriginal: number; datos?: ProductoOferta } | null>(null)
  const [buscarProd, setBuscarProd] = useState('')

  const urlPublica = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4000'}/tienda/${perfil.slug}`

  const productosDisponibles = productos.filter(p =>
    !ofertas.find(o => o.productoId === p.id) &&
    (p.nombre.toLowerCase().includes(buscarProd.toLowerCase()) || p.codigo.toLowerCase().includes(buscarProd.toLowerCase()))
  )

  const ofertasOrdenadas = [...ofertas].sort((a, b) => {
    if (a.destacado && !b.destacado) return -1
    if (!a.destacado && b.destacado) return 1
    return a.orden - b.orden
  })

  function compartirWhatsApp() {
    const texto = [
      `🛒 *${perfil.nombre}*`,
      perfil.ciudad ? `📍 ${perfil.ciudad}` : '',
      '',
      '🔥 *Nuestras ofertas de hoy:*',
      ...ofertas.filter(o => o.activo).map(o => `• ${o.nombre}: ~~${formatCurrency(o.precioOriginal)}~~ → *${formatCurrency(o.precioOferta)}*`),
      '',
      `🔗 Ver catálogo completo: ${urlPublica}`,
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Ofertas públicas</h1>
          <p className="text-slate-500 text-sm">{ofertas.filter(o => o.activo).length} oferta{ofertas.filter(o => o.activo).length !== 1 ? 's' : ''} activa{ofertas.filter(o => o.activo).length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowPerfil(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">
            <Settings className="w-4 h-4" /> Configurar tienda
          </button>
          <a href={urlPublica} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 text-indigo-600 font-semibold text-sm hover:bg-indigo-50">
            <Eye className="w-4 h-4" /> Ver tienda
          </a>
          <button onClick={compartirWhatsApp}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90"
            style={{ background: '#25D366' }}>
            <MessageCircle className="w-4 h-4" /> Compartir por WhatsApp
          </button>
        </div>
      </div>

      {/* link público */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center gap-3">
        <ExternalLink className="w-5 h-5 text-indigo-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-indigo-600 mb-0.5">Tu tienda pública</div>
          <div className="text-sm text-indigo-800 font-mono truncate">{urlPublica}</div>
        </div>
        <button onClick={() => { navigator.clipboard.writeText(urlPublica) }}
          className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700">
          Copiar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* columna izquierda: agregar productos */}
        <div className="space-y-4">
          <h2 className="font-bold text-slate-900">Agregar producto a ofertas</h2>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <Tag className="w-4 h-4 text-slate-400" />
            <input value={buscarProd} onChange={e => setBuscarProd(e.target.value)}
              placeholder="Buscar producto del catálogo..."
              className="bg-transparent flex-1 text-sm text-slate-700 outline-none" />
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {productosDisponibles.slice(0, 20).map(p => (
              <button key={p.id} onClick={() => setModalOferta({ productoId: p.id, nombre: p.nombre, precioOriginal: p.precio })}
                className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all text-left">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">📦</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">{p.nombre}</div>
                  <div className="text-xs text-slate-400">Precio: {formatCurrency(p.precio)} · Stock: {p.stock}</div>
                </div>
                <Plus className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              </button>
            ))}
            {productosDisponibles.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-sm">
                {productos.length === 0 ? 'No hay productos en el catálogo' : 'Todos los productos ya están en ofertas'}
              </div>
            )}
          </div>
        </div>

        {/* columna derecha: ofertas activas */}
        <div className="space-y-4">
          <h2 className="font-bold text-slate-900">Ofertas publicadas ({ofertas.length})</h2>
          {ofertasOrdenadas.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center">
              <Tag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Seleccioná productos de la izquierda para publicar ofertas</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[480px] overflow-y-auto">
              {ofertasOrdenadas.map(o => {
                const descuento = Math.round((1 - o.precioOferta / o.precioOriginal) * 100)
                return (
                  <div key={o.productoId} className={`bg-white border rounded-2xl p-3 flex items-center gap-3 shadow-sm ${!o.activo ? 'opacity-50' : 'border-slate-100'}`}>
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0">
                      {o.imagen ? <img src={o.imagen} alt="" className="w-full h-full object-cover" /> : <span className="text-xl">📦</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {o.destacado && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />}
                        <span className="text-sm font-semibold text-slate-800 truncate">{o.nombre}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400 line-through">{formatCurrency(o.precioOriginal)}</span>
                        <span className="text-sm font-black text-red-600">{formatCurrency(o.precioOferta)}</span>
                        {descuento > 0 && <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">{descuento}% OFF</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => toggleOferta(o.productoId)} title={o.activo ? 'Ocultar' : 'Mostrar'}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400">
                        {o.activo ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                      <button onClick={() => setModalOferta({ productoId: o.productoId, nombre: o.nombre, precioOriginal: o.precioOriginal, datos: o })}
                        className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button onClick={() => eliminarOferta(o.productoId)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {showPerfil && <ModalPerfil perfil={perfil} onGuardar={setPerfil} onCerrar={() => setShowPerfil(false)} />}

      {modalOferta && (
        <ModalOferta
          inicial={modalOferta.datos ?? { productoId: modalOferta.productoId, nombre: modalOferta.nombre, precioOriginal: modalOferta.precioOriginal }}
          onGuardar={o => {
            if (modalOferta.datos) editarOferta(o.productoId, o)
            else agregarOferta(o)
          }}
          onCerrar={() => setModalOferta(null)}
        />
      )}
    </div>
  )
}
