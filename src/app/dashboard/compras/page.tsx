'use client'
import { useState, useRef, useEffect } from 'react'
import {
  Truck, Plus, X, Search, CheckCircle, Clock, Package,
  ChevronDown, ChevronUp, Save, Percent, Camera, Upload,
  Loader2, AlertCircle, FileText, ScanLine
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useProductos, type Producto } from '@/lib/store/productos'
import { useProveedores } from '@/lib/store/proveedores'

// ─── tipos ────────────────────────────────────────────────────────────────────

type LineaCompra = {
  productoId: string   // vacío si viene del escáner y no matchea un producto existente
  nombre: string
  cantidad: number
  costoUnitario: number
  markupPct: number
  precioVenta: number
}

type OrdenCompra = {
  id: string
  proveedorId: string
  proveedorNombre: string
  fecha: string
  nroFactura: string
  estado: 'pendiente' | 'recibida'
  lineas: LineaCompra[]
  total: number
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function calcPrecioVenta(costo: number, pct: number) {
  return Math.round(costo * (1 + pct / 100))
}

function parsearFactura(texto: string) {
  const lineas: { descripcion: string; cantidad: number; precioUnit: number }[] = []
  const rows = texto.split('\n').map(l => l.trim()).filter(Boolean)
  const p1 = /^(\d+)[x\s]+(.+?)\s+\$?([\d.,]+)$/i
  const p2 = /^(.+?)\s+x\s*(\d+)\s+\$?([\d.,]+)$/i
  const p3 = /^(.+?)\s+([\d.,]+)\s+([\d.,]+)$/i
  for (const row of rows) {
    let m = row.match(p1)
    if (m) { const p = parseFloat(m[3].replace(/\./g, '').replace(',', '.')); if (!isNaN(p) && p > 0) { lineas.push({ cantidad: parseInt(m[1]), descripcion: m[2].trim(), precioUnit: p }); continue } }
    m = row.match(p2)
    if (m) { const p = parseFloat(m[3].replace(/\./g, '').replace(',', '.')); if (!isNaN(p) && p > 0) { lineas.push({ descripcion: m[1].trim(), cantidad: parseInt(m[2]), precioUnit: p }); continue } }
    m = row.match(p3)
    if (m) { const c = parseFloat(m[2].replace(',', '.')); const p = parseFloat(m[3].replace(/\./g, '').replace(',', '.')); if (!isNaN(c) && !isNaN(p) && p > 10 && c <= 999) { lineas.push({ descripcion: m[1].trim(), cantidad: c, precioUnit: p }) } }
  }
  return lineas.slice(0, 30)
}

// ─── buscador de producto existente ──────────────────────────────────────────

function BuscadorProducto({ productos, onSelect }: { productos: Producto[]; onSelect: (p: Producto) => void }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const filtrados = q.length > 1
    ? productos.filter(p => p.nombre.toLowerCase().includes(q.toLowerCase()) || p.codigo.toLowerCase().includes(q.toLowerCase()))
    : []
  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input value={q} onChange={e => { setQ(e.target.value); setOpen(true) }} onFocus={() => setOpen(true)}
          placeholder="Buscar producto por nombre o código..."
          className="bg-transparent flex-1 text-sm text-slate-700 outline-none" />
      </div>
      {open && filtrados.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-10 mt-1 max-h-48 overflow-y-auto">
          {filtrados.map(p => (
            <button key={p.id} onClick={() => { onSelect(p); setQ(''); setOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left">
              <Package className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-800 truncate">{p.nombre}</div>
                <div className="text-xs text-slate-400">Stock: {p.stock} · Costo: {formatCurrency(p.costo)}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── escáner de factura ───────────────────────────────────────────────────────

function EscanerFactura({ onLineas, onCerrar }: {
  onLineas: (lineas: { descripcion: string; cantidad: number; precioUnit: number }[]) => void
  onCerrar: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [imagen, setImagen] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [lineas, setLineas] = useState<{ descripcion: string; cantidad: number; precioUnit: number }[]>([])
  const [textoOCR, setTextoOCR] = useState('')
  const [paso, setPaso] = useState<'subir' | 'revisar'>('subir')
  const [error, setError] = useState('')

  async function procesarImagen(file: File) {
    setError('')
    const reader = new FileReader()
    reader.onload = e => setImagen(e.target?.result as string)
    reader.readAsDataURL(file)
    setScanning(true)
    try {
      const { createWorker } = await import('tesseract.js')
      const worker = await createWorker('spa')
      const { data: { text } } = await worker.recognize(file)
      await worker.terminate()
      setTextoOCR(text)
      const extraidas = parsearFactura(text)
      setLineas(extraidas.length ? extraidas : [{ descripcion: '', cantidad: 1, precioUnit: 0 }])
      setPaso('revisar')
    } catch {
      setError('No se pudo leer la imagen. Corregí los datos manualmente.')
      setLineas([{ descripcion: '', cantidad: 1, precioUnit: 0 }])
      setPaso('revisar')
    } finally {
      setScanning(false)
    }
  }

  function set(idx: number, field: string, val: string | number) {
    setLineas(ls => ls.map((l, i) => i === idx ? { ...l, [field]: val } : l))
  }

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-indigo-100">
        <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
          <ScanLine className="w-4 h-4" /> Escáner de factura / boleta
        </div>
        <button onClick={onCerrar} className="text-indigo-400 hover:text-indigo-700"><X className="w-4 h-4" /></button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
        onChange={e => e.target.files?.[0] && procesarImagen(e.target.files[0])} />

      {paso === 'subir' && (
        <div className="p-4 space-y-3">
          {!scanning && (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { fileRef.current?.setAttribute('capture', 'environment'); fileRef.current?.click() }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-indigo-200 hover:bg-indigo-50 transition-all">
                <Camera className="w-7 h-7 text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-600">Usar cámara</span>
              </button>
              <button onClick={() => { fileRef.current?.removeAttribute('capture'); fileRef.current?.click() }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-indigo-200 hover:bg-indigo-50 transition-all">
                <Upload className="w-7 h-7 text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-600">Subir imagen</span>
              </button>
            </div>
          )}
          {scanning && (
            <div className="flex flex-col items-center gap-2 py-6">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-sm text-indigo-700 font-medium">Leyendo factura con OCR...</p>
            </div>
          )}
          {imagen && !scanning && <img src={imagen} alt="Factura" className="w-full max-h-40 object-contain rounded-xl bg-white border border-indigo-200" />}
          {error && <div className="flex items-center gap-2 text-xs text-red-600"><AlertCircle className="w-4 h-4" />{error}</div>}
          <button onClick={() => { setLineas([{ descripcion: '', cantidad: 1, precioUnit: 0 }]); setPaso('revisar') }}
            className="w-full py-2 rounded-xl border border-indigo-300 text-indigo-600 text-xs font-semibold hover:bg-white transition-all flex items-center justify-center gap-1">
            <FileText className="w-3.5 h-3.5" /> Ingresar manualmente
          </button>
        </div>
      )}

      {paso === 'revisar' && (
        <div className="p-4 space-y-3">
          {imagen && <img src={imagen} alt="Factura" className="w-full max-h-32 object-contain rounded-xl bg-white border border-indigo-200" />}
          <div className="text-xs font-semibold text-indigo-600 mb-1">{lineas.length} línea{lineas.length !== 1 ? 's' : ''} detectada{lineas.length !== 1 ? 's' : ''} — revisá y corregí:</div>
          <div className="space-y-2">
            {lineas.map((l, idx) => (
              <div key={idx} className="grid gap-1.5 items-center" style={{ gridTemplateColumns: '1fr 56px 110px 24px' }}>
                <input value={l.descripcion} onChange={e => set(idx, 'descripcion', e.target.value)}
                  placeholder="Producto" className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white" />
                <input type="number" value={l.cantidad} min={1} onChange={e => set(idx, 'cantidad', Number(e.target.value))}
                  className="px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-center focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white" />
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">$</span>
                  <input type="number" value={l.precioUnit} min={0} onChange={e => set(idx, 'precioUnit', Number(e.target.value))}
                    className="w-full pl-5 pr-1 py-1.5 rounded-lg border border-slate-200 text-xs text-right focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white" />
                </div>
                <button onClick={() => setLineas(ls => ls.filter((_, i) => i !== idx))} className="text-slate-300 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
          <button onClick={() => setLineas(ls => [...ls, { descripcion: '', cantidad: 1, precioUnit: 0 }])}
            className="w-full py-1.5 rounded-lg border border-dashed border-indigo-300 text-indigo-500 text-xs font-semibold hover:bg-white transition-all">
            + Agregar línea
          </button>
          <div className="flex gap-2 pt-1">
            <button onClick={() => setPaso('subir')} className="py-2 px-3 rounded-xl border border-slate-200 text-slate-500 text-xs font-semibold hover:bg-white">← Volver</button>
            <button onClick={() => { onLineas(lineas.filter(l => l.descripcion.trim())); onCerrar() }}
              disabled={lineas.filter(l => l.descripcion.trim()).length === 0}
              className="flex-1 py-2 rounded-xl text-white text-xs font-bold hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-1"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              <CheckCircle className="w-3.5 h-3.5" /> Cargar {lineas.filter(l => l.descripcion.trim()).length} producto{lineas.filter(l => l.descripcion.trim()).length !== 1 ? 's' : ''}
            </button>
          </div>
          {textoOCR && (
            <details className="text-xs text-indigo-400">
              <summary className="cursor-pointer">Ver texto detectado</summary>
              <pre className="mt-1 p-2 bg-white rounded-lg text-[10px] overflow-x-auto whitespace-pre-wrap">{textoOCR}</pre>
            </details>
          )}
        </div>
      )}
    </div>
  )
}

// ─── modal nueva orden ────────────────────────────────────────────────────────

function ModalNuevaOrden({ productos, proveedores, onGuardar, onCerrar }: {
  productos: Producto[]
  proveedores: ReturnType<typeof useProveedores>['proveedores']
  onGuardar: (o: Omit<OrdenCompra, 'id' | 'estado'>) => void
  onCerrar: () => void
}) {
  const [proveedorId, setProveedorId] = useState('')
  const [nroFactura, setNroFactura] = useState('')
  const [lineas, setLineas] = useState<LineaCompra[]>([])
  const [showEscaner, setShowEscaner] = useState(false)

  const proveedorActivo = proveedores.filter(p => p.activo)
  const proveedorSeleccionado = proveedores.find(p => p.id === proveedorId)

  function agregarDesdeProducto(p: Producto) {
    if (lineas.find(l => l.productoId === p.id)) return
    const markupPct = p.costo > 0 && p.precio > 0 ? Math.round(((p.precio / p.costo) - 1) * 100) : 30
    setLineas(ls => [...ls, { productoId: p.id, nombre: p.nombre, cantidad: 1, costoUnitario: p.costo, markupPct, precioVenta: calcPrecioVenta(p.costo, markupPct) }])
  }

  function agregarDesdeEscaner(escaneadas: { descripcion: string; cantidad: number; precioUnit: number }[]) {
    const nuevas: LineaCompra[] = escaneadas.map(e => {
      // intentar matchear con producto existente
      const match = productos.find(p => p.nombre.toLowerCase().includes(e.descripcion.toLowerCase().slice(0, 8)) || e.descripcion.toLowerCase().includes(p.nombre.toLowerCase().slice(0, 8)))
      const markupPct = match && match.costo > 0 && match.precio > 0 ? Math.round(((match.precio / match.costo) - 1) * 100) : 30
      return {
        productoId: match?.id ?? '',
        nombre: match?.nombre ?? e.descripcion,
        cantidad: e.cantidad,
        costoUnitario: e.precioUnit,
        markupPct,
        precioVenta: calcPrecioVenta(e.precioUnit, markupPct),
      }
    })
    setLineas(ls => {
      const sinDuplicados = nuevas.filter(n => !ls.find(l => l.productoId && l.productoId === n.productoId))
      return [...ls, ...sinDuplicados]
    })
  }

  function updateLinea(idx: number, field: keyof LineaCompra, val: number | string) {
    setLineas(ls => ls.map((l, i) => {
      if (i !== idx) return l
      const updated = { ...l, [field]: val }
      if (field === 'costoUnitario' || field === 'markupPct') {
        updated.precioVenta = calcPrecioVenta(
          field === 'costoUnitario' ? Number(val) : l.costoUnitario,
          field === 'markupPct' ? Number(val) : l.markupPct
        )
      }
      return updated
    }))
  }

  const total = lineas.reduce((acc, l) => acc + l.costoUnitario * l.cantidad, 0)
  const valido = proveedorId && lineas.length > 0 && lineas.every(l => l.cantidad > 0 && l.costoUnitario > 0 && l.nombre.trim())

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl max-h-[92vh] flex flex-col">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-black text-slate-900">Nueva orden de compra</h2>
          <button onClick={onCerrar} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* proveedor y nro factura */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Proveedor *</label>
              <select value={proveedorId} onChange={e => setProveedorId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Seleccioná...</option>
                {proveedorActivo.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
              {proveedorActivo.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">Primero registrá un proveedor en el módulo Proveedores.</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">N° Factura / Remito</label>
              <input value={nroFactura} onChange={e => setNroFactura(e.target.value)} placeholder="0001-00012345"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          {/* escáner */}
          {showEscaner ? (
            <EscanerFactura onLineas={agregarDesdeEscaner} onCerrar={() => setShowEscaner(false)} />
          ) : (
            <button onClick={() => setShowEscaner(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-indigo-300 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition-all">
              <ScanLine className="w-4 h-4" /> Escanear factura del proveedor
            </button>
          )}

          {/* buscador manual */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Agregar producto del catálogo</label>
            <BuscadorProducto productos={productos} onSelect={agregarDesdeProducto} />
          </div>

          {/* líneas */}
          {lineas.length > 0 && (
            <div className="space-y-2">
              <div className="grid text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 gap-1"
                style={{ gridTemplateColumns: '1fr 70px 110px 90px 110px 24px' }}>
                <span>Producto</span><span className="text-center">Cant</span>
                <span className="text-center">Costo unit.</span><span className="text-center">Markup</span>
                <span className="text-center">P. Venta</span><span />
              </div>
              {lineas.map((l, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <input value={l.nombre} onChange={e => updateLinea(idx, 'nombre', e.target.value)}
                      className="flex-1 text-sm font-medium text-slate-800 bg-transparent border-b border-slate-200 focus:outline-none focus:border-indigo-400 pb-0.5" />
                    {l.productoId && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">En catálogo</span>}
                    {!l.productoId && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">Nuevo</span>}
                  </div>
                  <div className="grid gap-1.5 items-center" style={{ gridTemplateColumns: '1fr 70px 110px 90px 110px 24px' }}>
                    <div />
                    <div className="flex items-center gap-0.5 justify-center">
                      <button onClick={() => updateLinea(idx, 'cantidad', Math.max(1, l.cantidad - 1))}
                        className="w-5 h-5 rounded bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100">−</button>
                      <span className="w-6 text-center text-sm font-bold">{l.cantidad}</span>
                      <button onClick={() => updateLinea(idx, 'cantidad', l.cantidad + 1)}
                        className="w-5 h-5 rounded bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100">+</button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                      <input type="number" value={l.costoUnitario} min={0} onChange={e => updateLinea(idx, 'costoUnitario', Number(e.target.value))}
                        className="w-full pl-5 pr-1 py-1.5 rounded-lg border border-slate-200 text-xs text-right focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div className="relative">
                      <input type="number" value={l.markupPct} min={0} max={999} onChange={e => updateLinea(idx, 'markupPct', Number(e.target.value))}
                        className="w-full pr-5 pl-2 py-1.5 rounded-lg border border-indigo-300 bg-indigo-50 text-xs text-center font-bold text-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      <Percent className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-indigo-400" />
                    </div>
                    <div className="text-xs font-black text-emerald-600 text-center">{formatCurrency(l.precioVenta)}</div>
                    <button onClick={() => setLineas(ls => ls.filter((_, i) => i !== idx))} className="text-slate-300 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center px-1 pt-1 border-t border-slate-200">
                <span className="text-sm text-slate-500">Total a pagar al proveedor</span>
                <span className="text-xl font-black text-slate-900">{formatCurrency(total)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-slate-100 flex gap-3 flex-shrink-0">
          <button onClick={onCerrar} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancelar</button>
          <button onClick={() => onGuardar({ proveedorId, proveedorNombre: proveedorSeleccionado?.nombre ?? '', nroFactura, fecha: new Date().toISOString().split('T')[0], lineas, total })}
            disabled={!valido}
            className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Save className="w-4 h-4" /> Guardar orden
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── modal recibir ────────────────────────────────────────────────────────────

function ModalRecibir({ orden, onConfirmar, onCerrar }: { orden: OrdenCompra; onConfirmar: () => void; onCerrar: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-black text-slate-900">Confirmar recepción</h2>
          <p className="text-slate-500 text-sm mt-0.5">Proveedor: <strong>{orden.proveedorNombre}</strong>{orden.nroFactura && ` · Factura ${orden.nroFactura}`}</p>
        </div>
        <div className="p-6 space-y-3">
          <p className="text-sm text-slate-600">Al confirmar se actualizan stock y precios:</p>
          <div className="bg-slate-50 rounded-2xl p-4 space-y-2 max-h-60 overflow-y-auto">
            {orden.lineas.map((l, i) => (
              <div key={i} className="flex items-center justify-between text-sm gap-2">
                <span className="text-slate-700 truncate flex-1">{l.nombre}</span>
                <div className="flex items-center gap-2 flex-shrink-0 text-xs">
                  <span className="text-green-600 font-bold">+{l.cantidad}</span>
                  <span className="text-slate-400">costo {formatCurrency(l.costoUnitario)}</span>
                  <span className="font-bold text-slate-700">→ {formatCurrency(l.precioVenta)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-indigo-50 rounded-xl p-3 flex justify-between text-sm">
            <span className="text-indigo-700 font-semibold">Total pagado</span>
            <span className="font-black text-indigo-700">{formatCurrency(orden.total)}</span>
          </div>
        </div>
        <div className="p-6 border-t border-slate-100 flex gap-3">
          <button onClick={onCerrar} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancelar</button>
          <button onClick={onConfirmar}
            className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
            <CheckCircle className="w-4 h-4" /> Recibir mercadería
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── página ───────────────────────────────────────────────────────────────────

export default function ComprasPage() {
  const { productos, editar, agregar } = useProductos()
  const { proveedores } = useProveedores()
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([])
  const [showNueva, setShowNueva] = useState(false)
  const [recibiendo, setRecibiendo] = useState<OrdenCompra | null>(null)
  const [expandida, setExpandida] = useState<string | null>(null)

  function crearOrden(datos: Omit<OrdenCompra, 'id' | 'estado'>) {
    setOrdenes(os => [{ ...datos, id: String(Date.now()), estado: 'pendiente' }, ...os])
    setShowNueva(false)
  }

  function recibirOrden(orden: OrdenCompra) {
    orden.lineas.forEach(l => {
      if (l.productoId) {
        // producto existente: actualizar stock, costo y precio
        const prod = productos.find(p => p.id === l.productoId)
        if (!prod) return
        editar(prod.id, { ...prod, stock: prod.stock + l.cantidad, costo: l.costoUnitario, precio: l.precioVenta })
      } else {
        // producto nuevo: crear en el catálogo
        const codigo = 'P' + String(Date.now()).slice(-5)
        agregar({
          codigo,
          nombre: l.nombre,
          categoria: 'Sin categoría',
          stock: l.cantidad,
          minimo: 5,
          costo: l.costoUnitario,
          precio: l.precioVenta,
        })
      }
    })
    setOrdenes(os => os.map(o => o.id === orden.id ? { ...o, estado: 'recibida' } : o))
    setRecibiendo(null)
  }

  const pendientes = ordenes.filter(o => o.estado === 'pendiente').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Compras a proveedores</h1>
          <p className="text-slate-500 text-sm">{ordenes.length === 0 ? 'Sin órdenes' : `${ordenes.length} órdenes · ${pendientes} pendiente${pendientes !== 1 ? 's' : ''}`}</p>
        </div>
        <button onClick={() => setShowNueva(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
          <Plus className="w-4 h-4" /> Nueva orden de compra
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-black text-slate-900">{ordenes.length}</div>
          <div className="text-sm text-slate-500 mt-0.5">Órdenes totales</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="text-2xl font-black text-amber-600">{pendientes}</div>
          <div className="text-sm text-amber-600 mt-0.5">Pendientes de recibir</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="text-2xl font-black text-green-600">{formatCurrency(ordenes.filter(o => o.estado === 'recibida').reduce((a, o) => a + o.total, 0))}</div>
          <div className="text-sm text-green-600 mt-0.5">Total comprado</div>
        </div>
      </div>

      {ordenes.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No hay órdenes de compra todavía</p>
          <p className="text-slate-400 text-sm mt-1">Registrá un proveedor y creá tu primera orden</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ordenes.map(o => (
            <div key={o.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${o.estado === 'recibida' ? 'bg-green-100' : 'bg-amber-100'}`}>
                  {o.estado === 'recibida' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Clock className="w-5 h-5 text-amber-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900">{o.proveedorNombre}</span>
                    {o.nroFactura && <span className="text-xs text-slate-400 font-mono">#{o.nroFactura}</span>}
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${o.estado === 'recibida' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {o.estado === 'recibida' ? 'Recibida' : 'Pendiente'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {o.fecha} · {o.lineas.length} producto{o.lineas.length !== 1 ? 's' : ''} · Total: <span className="font-semibold text-slate-600">{formatCurrency(o.total)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {o.estado === 'pendiente' && (
                    <button onClick={() => setRecibiendo(o)}
                      className="px-4 py-2 rounded-xl text-white text-xs font-bold hover:opacity-90 flex items-center gap-1.5"
                      style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                      <CheckCircle className="w-3.5 h-3.5" /> Recibir
                    </button>
                  )}
                  <button onClick={() => setExpandida(expandida === o.id ? null : o.id)}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-400">
                    {expandida === o.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {expandida === o.id && (
                <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                  <div className="grid text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1"
                    style={{ gridTemplateColumns: '1fr 60px 110px 80px 110px 110px' }}>
                    <span>Producto</span><span className="text-center">Cant</span>
                    <span className="text-right">Costo</span><span className="text-center">Markup</span>
                    <span className="text-right">P. Venta</span><span className="text-right">Subtotal</span>
                  </div>
                  {o.lineas.map((l, i) => (
                    <div key={i} className="grid items-center text-sm py-1.5 px-1 hover:bg-slate-50 rounded-lg"
                      style={{ gridTemplateColumns: '1fr 60px 110px 80px 110px 110px' }}>
                      <span className="text-slate-700 font-medium truncate">{l.nombre}</span>
                      <span className="text-center text-slate-500">{l.cantidad}</span>
                      <span className="text-right text-slate-600">{formatCurrency(l.costoUnitario)}</span>
                      <span className="text-center font-bold text-indigo-600">{l.markupPct}%</span>
                      <span className="text-right font-bold text-emerald-600">{formatCurrency(l.precioVenta)}</span>
                      <span className="text-right font-semibold text-slate-800">{formatCurrency(l.costoUnitario * l.cantidad)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showNueva && <ModalNuevaOrden productos={productos} proveedores={proveedores} onGuardar={crearOrden} onCerrar={() => setShowNueva(false)} />}
      {recibiendo && <ModalRecibir orden={recibiendo} onConfirmar={() => recibirOrden(recibiendo)} onCerrar={() => setRecibiendo(null)} />}
    </div>
  )
}
