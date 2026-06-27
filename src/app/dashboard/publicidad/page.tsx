'use client'
import { useState } from 'react'
import { Megaphone, Plus, Download, Image, Tag, Zap, Star, ShoppingBag } from 'lucide-react'

const plantillas = [
  { id: '1', nombre: 'Oferta del día', tipo: 'oferta', color: '#ef4444', colorFondo: '#fff1f1', emoji: '🔥', descripcion: 'Destacá tu precio especial' },
  { id: '2', nombre: 'Liquidación', tipo: 'liquidacion', color: '#f59e0b', colorFondo: '#fffbeb', emoji: '💥', descripcion: 'Para liquidar stock rápido' },
  { id: '3', nombre: 'Producto destacado', tipo: 'destacado', color: '#6366f1', colorFondo: '#eef2ff', emoji: '⭐', descripcion: 'Promoción de producto clave' },
  { id: '4', nombre: 'Promo del mes', tipo: 'promo', color: '#22c55e', colorFondo: '#f0fdf4', emoji: '📅', descripcion: 'Promoción mensual' },
  { id: '5', nombre: '2x1 especial', tipo: '2x1', color: '#8b5cf6', colorFondo: '#f5f3ff', emoji: '🎁', descripcion: 'Lleva 2 pagá 1' },
  { id: '6', nombre: 'Descuento %', tipo: 'descuento', color: '#06b6d4', colorFondo: '#ecfeff', emoji: '💎', descripcion: 'Porcentaje de descuento' },
]

const piezasCreadas = [
  { id: '1', nombre: 'Oferta Aceite', plantilla: 'Oferta del día', fecha: '2026-06-24', producto: 'Aceite Girasol', precio: 1850 },
  { id: '2', nombre: 'Promo Yerba', plantilla: 'Producto destacado', fecha: '2026-06-20', producto: 'Yerba Mate 1kg', precio: 3800 },
]

export default function PublicidadPage() {
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<string | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [form, setForm] = useState({ producto: '', precio: '', precioTachado: '', texto: '', telefono: '' })

  const plantilla = plantillas.find(p => p.id === plantillaSeleccionada)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Publicidad Digital</h1>
          <p className="text-slate-500 text-sm">Creá imágenes de ofertas para redes sociales en segundos</p>
        </div>
      </div>

      {!showEditor ? (
        <>
          {/* PLANTILLAS */}
          <div>
            <h2 className="font-bold text-slate-700 mb-4">Elegí una plantilla</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {plantillas.map(p => (
                <button key={p.id} onClick={() => { setPlantillaSeleccionada(p.id); setShowEditor(true) }}
                  className="group bg-white rounded-2xl p-4 border-2 border-slate-100 hover:border-indigo-300 transition-all hover:shadow-md text-center">
                  <div className="w-full aspect-square rounded-xl flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform"
                    style={{ background: p.colorFondo }}>
                    {p.emoji}
                  </div>
                  <div className="text-sm font-bold text-slate-800">{p.nombre}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{p.descripcion}</div>
                </button>
              ))}
            </div>
          </div>

          {/* PIEZAS CREADAS */}
          {piezasCreadas.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-700 mb-4">Publicidades creadas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {piezasCreadas.map(pieza => (
                  <div key={pieza.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                    <div className="w-full h-32 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl mb-4 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-2xl font-black">{pieza.producto}</div>
                        <div className="text-3xl font-black mt-1">${pieza.precio.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-slate-900">{pieza.nombre}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{pieza.plantilla} · {pieza.fecha}</div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-semibold hover:bg-indigo-100 transition-all">
                        <Download className="w-3.5 h-3.5" /> Descargar
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-all">
                        <Image className="w-3.5 h-3.5" /> Compartir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* EDITOR */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-900">Configurar publicidad</h2>
              <button onClick={() => setShowEditor(false)} className="text-sm text-slate-400 hover:text-slate-600">← Volver</button>
            </div>
            {plantilla && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-6" style={{ background: plantilla.colorFondo, color: plantilla.color }}>
                <span>{plantilla.emoji}</span> {plantilla.nombre}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre del producto / oferta</label>
                <input value={form.producto} onChange={e => setForm(f => ({ ...f, producto: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ej: Aceite Girasol 1L" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Precio oferta</label>
                  <input type="number" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="$0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Precio anterior (opcional)</label>
                  <input type="number" value={form.precioTachado} onChange={e => setForm(f => ({ ...f, precioTachado: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="$0.00" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Texto adicional</label>
                <textarea value={form.texto} onChange={e => setForm(f => ({ ...f, texto: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows={2} placeholder="Ej: Solo por hoy. Mientras dure el stock." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Teléfono / WhatsApp (opcional)</label>
                <input value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="11 1234-5678" />
              </div>
            </div>
            <button className="w-full mt-6 py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              <Download className="w-4 h-4" /> Descargar imagen
            </button>
          </div>

          {/* PREVIEW */}
          <div>
            <h2 className="font-bold text-slate-700 mb-4">Vista previa</h2>
            <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-xl flex items-center justify-center relative"
              style={{ background: plantilla ? `linear-gradient(135deg, ${plantilla.color}dd, ${plantilla.color}88)` : '#6366f1' }}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 0%, transparent 50%)' }} />
              <div className="relative text-center text-white px-8">
                {plantilla && <div className="text-5xl mb-4">{plantilla.emoji}</div>}
                <div className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-2">
                  {plantilla?.nombre || 'OFERTA ESPECIAL'}
                </div>
                <div className="text-3xl font-black mb-2">
                  {form.producto || 'Nombre del Producto'}
                </div>
                {form.precioTachado && (
                  <div className="text-xl opacity-60 line-through mb-1">${Number(form.precioTachado).toLocaleString('es-AR')}</div>
                )}
                <div className="text-5xl font-black">
                  {form.precio ? `$${Number(form.precio).toLocaleString('es-AR')}` : '$0.00'}
                </div>
                {form.texto && <div className="text-sm opacity-80 mt-3 font-medium">{form.texto}</div>}
                {form.telefono && <div className="mt-4 text-sm font-semibold opacity-90">📱 {form.telefono}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
