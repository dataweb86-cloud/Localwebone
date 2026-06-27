'use client'
import { useEffect, useState } from 'react'
import { MessageCircle, Clock, MapPin, Star, ExternalLink, Store } from 'lucide-react'
import type { PerfilComercio, ProductoOferta } from '@/lib/store/comercio'

const STORAGE_PERFIL = 'lw_perfil_comercio'
const STORAGE_OFERTAS = 'lw_ofertas'

function formatCurrency(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}

export default function TiendaClient({ slug }: { slug: string }) {
  const [perfil, setPerfil] = useState<PerfilComercio | null>(null)
  const [ofertas, setOfertas] = useState<ProductoOferta[]>([])
  const [filtro, setFiltro] = useState<'todas' | 'destacadas'>('todas')

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(STORAGE_PERFIL) ?? 'null')
      const o = JSON.parse(localStorage.getItem(STORAGE_OFERTAS) ?? '[]')
      if (p) setPerfil(p)
      setOfertas(o)
    } catch {}
  }, [])

  if (!perfil) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Tienda no encontrada</p>
          <p className="text-slate-400 text-sm mt-1">El comercio <strong>{slug}</strong> no existe o aún no configuró su tienda.</p>
        </div>
      </div>
    )
  }

  if (perfil.slug !== slug && perfil.slug) {
    // slug mismatch — still show but warn (in a real app this would 404)
  }

  const color = perfil.colorPrimario || '#6366f1'
  const ofertasActivas = ofertas.filter(o => o.activo)
  const destacadas = ofertasActivas.filter(o => o.destacado)
  const mostrar = filtro === 'destacadas' ? destacadas : ofertasActivas

  function compartirProducto(o: ProductoOferta) {
    const texto = [
      `🛒 *${perfil!.nombre}*`,
      `📦 *${o.nombre}*`,
      o.descripcion ? `_${o.descripcion}_` : '',
      '',
      `~~${formatCurrency(o.precioOriginal)}~~ → *${formatCurrency(o.precioOferta)}*`,
      o.precioOriginal > 0 ? `🔥 ${Math.round((1 - o.precioOferta / o.precioOriginal) * 100)}% OFF` : '',
      '',
      perfil!.whatsapp ? `📲 Consultá: wa.me/54${perfil!.whatsapp}` : '',
    ].filter(Boolean).join('\n')

    if (navigator.share) {
      navigator.share({ title: o.nombre, text: texto }).catch(() => {})
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank')
    }
  }

  function contactarWhatsApp() {
    if (!perfil?.whatsapp) return
    const texto = `Hola! Vi sus ofertas en LocalWeb y me interesa más información.`
    window.open(`https://wa.me/54${perfil.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* header */}
      <div className="text-white" style={{ background: `linear-gradient(135deg, ${color}dd, ${color})` }}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur overflow-hidden flex items-center justify-center flex-shrink-0">
              {perfil.logoUrl
                ? <img src={perfil.logoUrl} alt="logo" className="w-full h-full object-contain p-1" />
                : <span className="text-3xl font-black text-white">{perfil.nombre[0]}</span>
              }
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black leading-tight">{perfil.nombre}</h1>
              {perfil.descripcion && <p className="text-white/80 text-sm mt-0.5">{perfil.descripcion}</p>}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-5 text-sm text-white/80">
            {perfil.ciudad && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{perfil.ciudad}</span>
              </div>
            )}
            {perfil.horarios && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{perfil.horarios}</span>
              </div>
            )}
            {perfil.instagram && (
              <div className="flex items-center gap-1">
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                <span>{perfil.instagram}</span>
              </div>
            )}
          </div>

          {perfil.whatsapp && (
            <button onClick={contactarWhatsApp}
              className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur text-white font-semibold text-sm hover:bg-white/30 transition-all">
              <MessageCircle className="w-4 h-4" />
              Consultar por WhatsApp
            </button>
          )}
        </div>
      </div>

      {/* contenido */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* stats */}
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm border border-slate-100 text-sm font-semibold text-slate-700">
            {ofertasActivas.length} oferta{ofertasActivas.length !== 1 ? 's' : ''} disponible{ofertasActivas.length !== 1 ? 's' : ''}
          </div>
          {destacadas.length > 0 && (
            <button onClick={() => setFiltro(f => f === 'destacadas' ? 'todas' : 'destacadas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all ${filtro === 'destacadas' ? 'bg-amber-100 border-amber-200 text-amber-700' : 'bg-white border-slate-100 text-slate-500 shadow-sm hover:border-amber-200'}`}>
              <Star className="w-3.5 h-3.5" />
              Destacadas ({destacadas.length})
            </button>
          )}
        </div>

        {mostrar.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
            <p className="text-slate-400 text-sm">No hay ofertas {filtro === 'destacadas' ? 'destacadas' : 'disponibles'} en este momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...mostrar].sort((a, b) => {
              if (a.destacado && !b.destacado) return -1
              if (!a.destacado && b.destacado) return 1
              return a.orden - b.orden
            }).map(o => {
              const descuento = o.precioOriginal > 0 ? Math.round((1 - o.precioOferta / o.precioOriginal) * 100) : 0
              return (
                <div key={o.productoId} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                  {/* imagen */}
                  <div className="aspect-[4/3] bg-slate-100 relative flex items-center justify-center">
                    {o.imagen
                      ? <img src={o.imagen} alt={o.nombre} className="w-full h-full object-cover" />
                      : <span className="text-5xl">📦</span>
                    }
                    {descuento > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full">
                        {descuento}% OFF
                      </div>
                    )}
                    {o.destacado && (
                      <div className="absolute top-2 right-2 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-white fill-white" />
                      </div>
                    )}
                  </div>

                  {/* info */}
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 leading-tight">{o.nombre}</h3>
                    {o.descripcion && <p className="text-slate-500 text-xs mt-1 line-clamp-2">{o.descripcion}</p>}

                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-2xl font-black" style={{ color }}>{formatCurrency(o.precioOferta)}</span>
                      {o.precioOriginal !== o.precioOferta && (
                        <span className="text-sm text-slate-400 line-through">{formatCurrency(o.precioOriginal)}</span>
                      )}
                    </div>

                    <button onClick={() => compartirProducto(o)}
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                      style={{ background: '#25D366' }}>
                      <MessageCircle className="w-4 h-4" />
                      Consultar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* footer */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Store className="w-3.5 h-3.5" />
            <span>Tienda creada con <strong className="text-slate-500">LocalWeb One</strong></span>
          </div>
          {perfil.instagram && (
            <a href={`https://instagram.com/${perfil.instagram.replace('@', '')}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 text-slate-400 text-xs hover:text-pink-500 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{perfil.instagram}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
