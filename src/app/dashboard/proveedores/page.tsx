'use client'
import { useState, useRef } from 'react'
import {
  Truck, Plus, Search, Edit, Trash2, X, Save, Phone, Mail,
  MapPin, User, Building2, ToggleLeft, ToggleRight, Camera,
  Upload, Loader2, CheckCircle, AlertCircle, FileText
} from 'lucide-react'
import { useProveedores, type Proveedor } from '@/lib/store/proveedores'
import { useProductos } from '@/lib/store/productos'

// ─── constantes ──────────────────────────────────────────────────────────────

const CATEGORIAS_PROVEEDOR = [
  'Alimentos y bebidas', 'Limpieza y cuidado personal', 'Electrónica',
  'Indumentaria y textil', 'Ferretería y construcción', 'Librería y papelería',
  'Gastronomía', 'Farmacia', 'Mayorista general', 'Otro',
]
const CONDICIONES_IVA = [
  'Responsable Inscripto', 'Monotributista', 'Exento', 'No Responsable', 'Consumidor Final',
]
const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones',
  'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
  'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
]

type FormProveedor = Omit<Proveedor, 'id' | 'fechaAlta' | 'activo'>

const emptyForm: FormProveedor = {
  nombre: '', razonSocial: '', cuit: '', email: '', telefono: '', celular: '',
  direccion: '', ciudad: '', provincia: 'Buenos Aires', contacto: '',
  categoria: 'Alimentos y bebidas', condicionIva: 'Responsable Inscripto', notas: '',
}

// ─── modal escáner de factura ─────────────────────────────────────────────────

type LineaEscaneada = { descripcion: string; cantidad: number; precioUnit: number }

function ModalEscaner({ onCerrar }: { onCerrar: () => void }) {
  const { productos } = useProductos()
  const fileRef = useRef<HTMLInputElement>(null)
  const [imagen, setImagen] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [textoOCR, setTextoOCR] = useState('')
  const [lineas, setLineas] = useState<LineaEscaneada[]>([])
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
      setError('No se pudo leer la imagen. Intentá con mejor iluminación o ingresá los datos manualmente.')
      setLineas([{ descripcion: '', cantidad: 1, precioUnit: 0 }])
      setPaso('revisar')
    } finally {
      setScanning(false)
    }
  }

  // Parser básico para texto de facturas argentinas
  function parsearFactura(texto: string): LineaEscaneada[] {
    const lineas: LineaEscaneada[] = []
    const rows = texto.split('\n').map(l => l.trim()).filter(Boolean)

    // Patrones comunes en facturas/boletas argentinas:
    // "2 Aceite Girasol 1L $1850,00"
    // "Aceite Girasol 1L x2 1850.00"
    // "001 Aceite Girasol 1,850.00"
    const patron1 = /^(\d+)[x\s]+(.+?)\s+\$?([\d.,]+)$/i
    const patron2 = /^(.+?)\s+x\s*(\d+)\s+\$?([\d.,]+)$/i
    const patron3 = /^(.+?)\s+([\d.,]+)\s+([\d.,]+)$/i  // desc cant precio

    for (const row of rows) {
      let match = row.match(patron1)
      if (match) {
        const precio = parseFloat(match[3].replace(/\./g, '').replace(',', '.'))
        if (!isNaN(precio) && precio > 0) {
          lineas.push({ cantidad: parseInt(match[1]), descripcion: match[2].trim(), precioUnit: precio })
          continue
        }
      }
      match = row.match(patron2)
      if (match) {
        const precio = parseFloat(match[3].replace(/\./g, '').replace(',', '.'))
        if (!isNaN(precio) && precio > 0) {
          lineas.push({ descripcion: match[1].trim(), cantidad: parseInt(match[2]), precioUnit: precio })
          continue
        }
      }
      match = row.match(patron3)
      if (match) {
        const cant = parseFloat(match[2].replace(',', '.'))
        const precio = parseFloat(match[3].replace(/\./g, '').replace(',', '.'))
        if (!isNaN(cant) && !isNaN(precio) && precio > 10 && cant <= 999) {
          lineas.push({ descripcion: match[1].trim(), cantidad: cant, precioUnit: precio })
        }
      }
    }
    return lineas.slice(0, 30)
  }

  function setLinea(idx: number, field: keyof LineaEscaneada, val: string | number) {
    setLineas(ls => ls.map((l, i) => i === idx ? { ...l, [field]: val } : l))
  }

  function agregarLinea() {
    setLineas(ls => [...ls, { descripcion: '', cantidad: 1, precioUnit: 0 }])
  }

  function quitarLinea(idx: number) {
    setLineas(ls => ls.filter((_, i) => i !== idx))
  }

  const total = lineas.reduce((a, l) => a + l.cantidad * l.precioUnit, 0)

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl max-h-[92vh] flex flex-col">
        {/* header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-black text-slate-900">Escanear factura / boleta</h2>
            <p className="text-slate-400 text-xs mt-0.5">
              {paso === 'subir' ? 'Subí o sacá una foto de la factura del proveedor' : 'Revisá y editá los productos detectados'}
            </p>
          </div>
          <button onClick={onCerrar} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {paso === 'subir' ? (
            <div className="p-6 space-y-4">
              <input ref={fileRef} type="file" accept="image/*,application/pdf" capture="environment"
                className="hidden" onChange={e => e.target.files?.[0] && procesarImagen(e.target.files[0])} />

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => { if (fileRef.current) { fileRef.current.setAttribute('capture', 'environment'); fileRef.current.click() } }}
                  className="flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50 hover:bg-indigo-100 transition-all">
                  <Camera className="w-10 h-10 text-indigo-400" />
                  <div className="text-center">
                    <div className="font-bold text-indigo-700">Usar cámara</div>
                    <div className="text-xs text-indigo-400 mt-0.5">Sacá una foto de la factura</div>
                  </div>
                </button>
                <button onClick={() => { if (fileRef.current) { fileRef.current.removeAttribute('capture'); fileRef.current.click() } }}
                  className="flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all">
                  <Upload className="w-10 h-10 text-slate-400" />
                  <div className="text-center">
                    <div className="font-bold text-slate-600">Subir imagen</div>
                    <div className="text-xs text-slate-400 mt-0.5">JPG, PNG o PDF</div>
                  </div>
                </button>
              </div>

              {scanning && (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                  <p className="text-slate-600 font-medium">Leyendo factura con OCR...</p>
                  <p className="text-slate-400 text-sm">Esto puede tomar unos segundos</p>
                </div>
              )}

              {imagen && !scanning && (
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <img src={imagen} alt="Factura" className="w-full max-h-60 object-contain bg-slate-50" />
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-200 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="border-t border-slate-100 pt-4">
                <button onClick={() => { setLineas([{ descripcion: '', cantidad: 1, precioUnit: 0 }]); setPaso('revisar') }}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" /> Ingresar productos manualmente
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {imagen && (
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <img src={imagen} alt="Factura" className="w-full max-h-40 object-contain bg-slate-50" />
                </div>
              )}

              {lineas.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Se detectaron <strong>{lineas.length}</strong> línea{lineas.length !== 1 ? 's' : ''}. Revisá y corregí si hace falta.</span>
                </div>
              )}

              {/* tabla de líneas */}
              <div>
                <div className="grid text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1"
                  style={{ gridTemplateColumns: '1fr 70px 130px 32px' }}>
                  <span>Descripción</span>
                  <span className="text-center">Cant.</span>
                  <span className="text-right">Precio unit.</span>
                  <span />
                </div>
                <div className="space-y-2">
                  {lineas.map((l, idx) => (
                    <div key={idx} className="grid items-center gap-2" style={{ gridTemplateColumns: '1fr 70px 130px 32px' }}>
                      <input value={l.descripcion} onChange={e => setLinea(idx, 'descripcion', e.target.value)}
                        placeholder="Nombre del producto"
                        className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      <input type="number" value={l.cantidad} min={1} onChange={e => setLinea(idx, 'cantidad', Number(e.target.value))}
                        className="px-2 py-2 rounded-xl border border-slate-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                        <input type="number" value={l.precioUnit} min={0} onChange={e => setLinea(idx, 'precioUnit', Number(e.target.value))}
                          className="w-full pl-6 pr-2 py-2 rounded-xl border border-slate-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <button onClick={() => quitarLinea(idx)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={agregarLinea}
                  className="mt-3 w-full py-2 rounded-xl border border-dashed border-indigo-300 text-indigo-500 text-sm font-semibold hover:bg-indigo-50 transition-all flex items-center justify-center gap-1">
                  <Plus className="w-4 h-4" /> Agregar línea
                </button>
              </div>

              <div className="flex justify-between items-center px-1 pt-2 border-t border-slate-200">
                <span className="text-sm text-slate-500">Total factura</span>
                <span className="text-xl font-black text-slate-900">
                  ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {textoOCR && (
                <details className="text-xs text-slate-400">
                  <summary className="cursor-pointer hover:text-slate-600">Ver texto detectado por OCR</summary>
                  <pre className="mt-2 p-3 bg-slate-50 rounded-xl overflow-x-auto whitespace-pre-wrap text-[11px]">{textoOCR}</pre>
                </details>
              )}
            </div>
          )}
        </div>

        {paso === 'revisar' && (
          <div className="p-5 border-t border-slate-100 flex gap-3 flex-shrink-0">
            <button onClick={() => setPaso('subir')} className="py-2.5 px-4 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">
              ← Volver
            </button>
            <button
              onClick={() => {
                // guardar en sessionStorage para que compras lo use
                sessionStorage.setItem('lw_lineas_escaneadas', JSON.stringify(lineas))
                alert(`${lineas.filter(l => l.descripcion).length} productos listos. Ahora creá una orden de compra para cargarlos.`)
                onCerrar()
              }}
              disabled={lineas.filter(l => l.descripcion.trim()).length === 0}
              className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              <CheckCircle className="w-4 h-4" /> Usar estos productos
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── modal proveedor ──────────────────────────────────────────────────────────

function ModalProveedor({ titulo, form, onChange, onGuardar, onCerrar }: {
  titulo: string
  form: FormProveedor
  onChange: (f: FormProveedor) => void
  onGuardar: () => void
  onCerrar: () => void
}) {
  function set(field: keyof FormProveedor, val: string) { onChange({ ...form, [field]: val }) }
  const valido = form.nombre.trim() && form.cuit.trim()

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl max-h-[92vh] flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-black text-slate-900">{titulo}</h2>
          <button onClick={onCerrar} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* datos fiscales */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-bold text-slate-700">Datos fiscales</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Nombre comercial *</label>
                <input value={form.nombre} onChange={e => set('nombre', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ej: Distribuidora Norte" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Razón social</label>
                <input value={form.razonSocial} onChange={e => set('razonSocial', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Nombre S.A. / S.R.L." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">CUIT *</label>
                <input value={form.cuit} onChange={e => set('cuit', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="20-12345678-9" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Condición IVA</label>
                <select value={form.condicionIva} onChange={e => set('condicionIva', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {CONDICIONES_IVA.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Categoría / Rubro</label>
                <select value={form.categoria} onChange={e => set('categoria', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {CATEGORIAS_PROVEEDOR.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* contacto */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-bold text-slate-700">Contacto</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Persona de contacto</label>
                <input value={form.contacto} onChange={e => set('contacto', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Nombre del vendedor" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="proveedor@email.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Teléfono fijo</label>
                <input value={form.telefono} onChange={e => set('telefono', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0341 4000000" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Celular / WhatsApp</label>
                <input value={form.celular} onChange={e => set('celular', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="3415001234" />
              </div>
            </div>
          </div>

          {/* dirección */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-bold text-slate-700">Dirección</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Dirección</label>
                <input value={form.direccion} onChange={e => set('direccion', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Av. San Martín 1234" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Ciudad</label>
                <input value={form.ciudad} onChange={e => set('ciudad', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Rosario" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Provincia</label>
                <select value={form.provincia} onChange={e => set('provincia', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {PROVINCIAS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* notas */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Notas / Observaciones</label>
            <textarea value={form.notas} onChange={e => set('notas', e.target.value)} rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Días de entrega, condiciones de pago, etc." />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex gap-3 flex-shrink-0">
          <button onClick={onCerrar} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancelar</button>
          <button onClick={onGuardar} disabled={!valido}
            className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Save className="w-4 h-4" /> Guardar proveedor
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── página principal ─────────────────────────────────────────────────────────

export default function ProveedoresPage() {
  const { proveedores, agregar, editar, eliminar, toggleActivo } = useProveedores()
  const [search, setSearch] = useState('')
  const [showNuevo, setShowNuevo] = useState(false)
  const [formNuevo, setFormNuevo] = useState<FormProveedor>(emptyForm)
  const [editando, setEditando] = useState<Proveedor | null>(null)
  const [formEdit, setFormEdit] = useState<FormProveedor>(emptyForm)
  const [eliminando, setEliminando] = useState<Proveedor | null>(null)
  const [showEscaner, setShowEscaner] = useState(false)
  const [detalle, setDetalle] = useState<Proveedor | null>(null)

  const filtrados = proveedores.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.cuit.includes(search) ||
    p.categoria.toLowerCase().includes(search.toLowerCase())
  )

  function abrirEditar(p: Proveedor) {
    setEditando(p)
    const { id, fechaAlta, activo, ...resto } = p
    setFormEdit(resto)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Proveedores</h1>
          <p className="text-slate-500 text-sm">{proveedores.length} proveedor{proveedores.length !== 1 ? 'es' : ''} registrado{proveedores.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowEscaner(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-300 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition-all">
            <Camera className="w-4 h-4" /> Escanear factura
          </button>
          <button onClick={() => { setFormNuevo(emptyForm); setShowNuevo(true) }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Plus className="w-4 h-4" /> Nuevo proveedor
          </button>
        </div>
      </div>

      {/* buscador */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl">
          <Search className="w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, CUIT o rubro..."
            className="bg-transparent flex-1 text-sm text-slate-700 outline-none" />
        </div>
      </div>

      {/* lista */}
      {filtrados.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">
            {proveedores.length === 0 ? 'No hay proveedores registrados aún' : 'Sin resultados para la búsqueda'}
          </p>
          {proveedores.length === 0 && (
            <p className="text-slate-400 text-sm mt-1">Registrá tu primer proveedor para empezar</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtrados.map(p => (
            <div key={p.id} className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-all ${p.activo ? 'border-slate-100' : 'border-slate-200 opacity-60'}`}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 truncate">{p.nombre}</div>
                    {p.razonSocial && <div className="text-xs text-slate-400 truncate">{p.razonSocial}</div>}
                  </div>
                  <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${p.activo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {p.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Building2 className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                    <span>CUIT: <span className="font-mono">{p.cuit}</span> · {p.condicionIva}</span>
                  </div>
                  {p.contacto && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                      <span>{p.contacto}</span>
                    </div>
                  )}
                  {(p.telefono || p.celular) && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                      <span>{p.celular || p.telefono}</span>
                    </div>
                  )}
                  {p.email && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Mail className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                      <span className="truncate">{p.email}</span>
                    </div>
                  )}
                  {(p.ciudad || p.provincia) && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                      <span>{[p.ciudad, p.provincia].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1">
                  <span className="flex-1 text-xs bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full">{p.categoria}</span>
                  <button onClick={() => toggleActivo(p.id)} title={p.activo ? 'Desactivar' : 'Activar'}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                    {p.activo ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                  <button onClick={() => abrirEditar(p)} title="Editar"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEliminando(p)} title="Eliminar"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* modales */}
      {showNuevo && (
        <ModalProveedor titulo="Nuevo proveedor" form={formNuevo} onChange={setFormNuevo}
          onGuardar={() => { agregar(formNuevo); setShowNuevo(false) }}
          onCerrar={() => setShowNuevo(false)} />
      )}

      {editando && (
        <ModalProveedor titulo={`Editar: ${editando.nombre}`} form={formEdit} onChange={setFormEdit}
          onGuardar={() => { editar(editando.id, formEdit); setEditando(null) }}
          onCerrar={() => setEditando(null)} />
      )}

      {eliminando && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="font-black text-slate-900 text-lg mb-2">¿Eliminar proveedor?</h3>
            <p className="text-slate-500 text-sm mb-6">Se eliminará <strong>{eliminando.nombre}</strong> y no se podrá recuperar.</p>
            <div className="flex gap-3">
              <button onClick={() => setEliminando(null)} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm">Cancelar</button>
              <button onClick={() => { eliminar(eliminando.id); setEliminando(null) }} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {showEscaner && <ModalEscaner onCerrar={() => setShowEscaner(false)} />}
    </div>
  )
}
