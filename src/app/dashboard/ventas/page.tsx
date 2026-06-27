'use client'
import { useState, useRef } from 'react'
import { ShoppingCart, Plus, Search, Package, X, CreditCard, Banknote, Smartphone, CheckCircle, Minus, Printer, MessageCircle, Receipt } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useProductos } from '@/lib/store/productos'

type CartItem = { id: string; nombre: string; precio: number; cantidad: number }

const METODOS_PAGO = [
  { id: 'efectivo', label: 'Efectivo', icon: Banknote },
  { id: 'debito', label: 'Débito', icon: CreditCard },
  { id: 'credito', label: 'Crédito', icon: CreditCard },
  { id: 'transferencia', label: 'Transferencia', icon: Smartphone },
  { id: 'qr', label: 'QR / MP', icon: Smartphone },
]

interface VentaConfirmada {
  nro: string
  items: CartItem[]
  subtotal: number
  descuentoMonto: number
  total: number
  metodoPago: string
  fecha: Date
}

const IVA_TASA = 0.21

function calcularImpuestos(total: number) {
  const neto = total / (1 + IVA_TASA)
  const iva = total - neto
  return { neto, iva }
}

function TicketPrint({ venta, comercioNombre, comercioDir, comercioCuit }: {
  venta: VentaConfirmada
  comercioNombre: string
  comercioDir?: string
  comercioCuit?: string
}) {
  const { neto, iva } = calcularImpuestos(venta.total)

  return (
    <div id="ticket-print" className="hidden print:block font-mono text-[11px]" style={{ width: '80mm', padding: '5mm' }}>
      {/* ENCABEZADO */}
      <div className="text-center mb-3">
        <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: 1 }}>{comercioNombre}</div>
        {comercioDir && <div style={{ fontSize: 10, marginTop: 2 }}>{comercioDir}</div>}
        {comercioCuit && <div style={{ fontSize: 10 }}>CUIT: {comercioCuit}</div>}
        <div style={{ fontSize: 10, marginTop: 4 }}>
          {venta.fecha.toLocaleDateString('es-AR')} {venta.fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div style={{ fontSize: 10 }}>Ticket N° {venta.nro}</div>
      </div>

      {/* SEPARADOR */}
      <div style={{ borderTop: '1px dashed black', marginBottom: 6 }} />

      {/* ENCABEZADO COLUMNAS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontWeight: 700, marginBottom: 4 }}>
        <span style={{ flex: 3 }}>DESCRIPCIÓN</span>
        <span style={{ flex: 1, textAlign: 'center' }}>CANT</span>
        <span style={{ flex: 2, textAlign: 'right' }}>P/U</span>
        <span style={{ flex: 2, textAlign: 'right' }}>SUBTOTAL</span>
      </div>

      {/* ITEMS */}
      {venta.items.map(i => (
        <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: 10 }}>
          <span style={{ flex: 3, paddingRight: 4, wordBreak: 'break-word' }}>{i.nombre}</span>
          <span style={{ flex: 1, textAlign: 'center' }}>{i.cantidad}</span>
          <span style={{ flex: 2, textAlign: 'right' }}>{formatCurrency(i.precio)}</span>
          <span style={{ flex: 2, textAlign: 'right' }}>{formatCurrency(i.precio * i.cantidad)}</span>
        </div>
      ))}

      {/* SEPARADOR */}
      <div style={{ borderTop: '1px dashed black', marginTop: 6, marginBottom: 6 }} />

      {/* TOTALES */}
      <div style={{ fontSize: 10 }}>
        {venta.descuentoMonto > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <span>Descuento</span><span>-{formatCurrency(venta.descuentoMonto)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <span>Subtotal neto</span><span>{formatCurrency(neto)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <span>IVA (21%)</span><span>{formatCurrency(iva)}</span>
        </div>
        <div style={{ borderTop: '1px solid black', marginTop: 4, paddingTop: 4, display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 13 }}>
          <span>TOTAL</span><span>{formatCurrency(venta.total)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10 }}>
          <span>Forma de pago</span><span style={{ textTransform: 'capitalize' }}>{venta.metodoPago}</span>
        </div>
      </div>

      {/* PIE */}
      <div style={{ borderTop: '1px dashed black', marginTop: 8, paddingTop: 6, textAlign: 'center', fontSize: 10 }}>
        ¡Gracias por su compra!<br />
        <span style={{ fontSize: 9 }}>Ticket no válido como factura</span>
      </div>
    </div>
  )
}

function ModalVenta({ venta, onNueva, comercioNombre, comercioDir, comercioCuit }: {
  venta: VentaConfirmada
  onNueva: () => void
  comercioNombre: string
  comercioDir?: string
  comercioCuit?: string
}) {
  const [telWhatsapp, setTelWhatsapp] = useState('')
  const { neto, iva } = calcularImpuestos(venta.total)

  function imprimir() {
    const { neto, iva } = calcularImpuestos(venta.total)
    const filas = venta.items.map(i => `
      <tr>
        <td style="padding:2px 4px">${i.nombre}</td>
        <td style="padding:2px 4px;text-align:center">${i.cantidad}</td>
        <td style="padding:2px 4px;text-align:right">${formatCurrency(i.precio)}</td>
        <td style="padding:2px 4px;text-align:right">${formatCurrency(i.precio * i.cantidad)}</td>
      </tr>`).join('')

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Courier New', monospace; font-size: 11px; width: 80mm; padding: 5mm; }
    .center { text-align: center; }
    .bold { font-weight: bold; }
    .sep { border-top: 1px dashed #000; margin: 6px 0; }
    table { width: 100%; border-collapse: collapse; }
    th { font-size: 9px; text-transform: uppercase; border-bottom: 1px solid #000; padding: 2px 4px; }
    th:nth-child(1) { text-align: left; }
    th:nth-child(2), th:nth-child(3), th:nth-child(4) { text-align: right; }
    th:nth-child(2) { text-align: center; }
    .totales td { padding: 2px 4px; }
    .totales td:last-child { text-align: right; }
    .total-final { font-size: 14px; font-weight: 900; border-top: 1px solid #000; padding-top: 4px; margin-top: 4px; }
    .pie { text-align: center; margin-top: 8px; border-top: 1px dashed #000; padding-top: 6px; font-size: 10px; }
  </style>
</head>
<body>
  <div class="center bold" style="font-size:15px;margin-bottom:2px">${comercioNombre}</div>
  ${comercioDir ? `<div class="center" style="font-size:10px">${comercioDir}</div>` : ''}
  ${comercioCuit ? `<div class="center" style="font-size:10px">CUIT: ${comercioCuit}</div>` : ''}
  <div class="center" style="font-size:10px;margin-top:4px">
    ${venta.fecha.toLocaleDateString('es-AR')} ${venta.fecha.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}
    &nbsp;·&nbsp; Ticket N° ${venta.nro}
  </div>

  <div class="sep"></div>

  <table>
    <thead>
      <tr>
        <th style="text-align:left">Descripción</th>
        <th style="text-align:center">Cant</th>
        <th style="text-align:right">P/U</th>
        <th style="text-align:right">Subtotal</th>
      </tr>
    </thead>
    <tbody>${filas}</tbody>
  </table>

  <div class="sep"></div>

  <table class="totales">
    ${venta.descuentoMonto > 0 ? `<tr><td>Descuento</td><td>-${formatCurrency(venta.descuentoMonto)}</td></tr>` : ''}
    <tr><td>Neto sin IVA</td><td>${formatCurrency(neto)}</td></tr>
    <tr><td>IVA 21%</td><td>${formatCurrency(iva)}</td></tr>
    <tr class="total-final"><td><b>TOTAL</b></td><td><b>${formatCurrency(venta.total)}</b></td></tr>
    <tr><td style="font-size:10px">Forma de pago</td><td style="font-size:10px;text-transform:capitalize">${venta.metodoPago}</td></tr>
  </table>

  <div class="pie">
    ¡Gracias por su compra!<br/>
    <span style="font-size:9px">Ticket no válido como factura</span>
  </div>
</body>
</html>`

    const w = window.open('', '_blank', 'width=340,height=600,toolbar=0,menubar=0')
    if (!w) return
    w.document.write(html)
    w.document.close()
    w.focus()
    w.print()
    w.close()
  }

  function enviarWhatsapp() {
    const tel = telWhatsapp.replace(/\D/g, '')
    const separador = '─────────────────────'
    const encabezadoCol = `${'PRODUCTO'.padEnd(18)} CANT  SUBTOTAL`
    const lineas = venta.items.map(i => {
      const nombre = i.nombre.length > 18 ? i.nombre.slice(0, 17) + '…' : i.nombre.padEnd(18)
      const cant = String(i.cantidad).padStart(3)
      const sub = formatCurrency(i.precio * i.cantidad).padStart(10)
      return `${nombre}${cant}  ${sub}`
    }).join('\n')

    const partes = [
      `🧾 *${comercioNombre}*`,
      comercioDir ? `📍 ${comercioDir}` : null,
      comercioCuit ? `CUIT: ${comercioCuit}` : null,
      `📅 ${venta.fecha.toLocaleDateString('es-AR')} ${venta.fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`,
      `N° Ticket: *${venta.nro}*`,
      '',
      separador,
      `\`\`\``,
      encabezadoCol,
      separador,
      lineas,
      separador,
      venta.descuentoMonto > 0 ? `Descuento:       -${formatCurrency(venta.descuentoMonto)}` : null,
      `Neto (sin IVA):   ${formatCurrency(neto)}`,
      `IVA 21%:          ${formatCurrency(iva)}`,
      `\`\`\``,
      `*TOTAL: ${formatCurrency(venta.total)}*`,
      `Forma de pago: ${venta.metodoPago}`,
      '',
      '¡Gracias por su compra! 🙌',
    ].filter(Boolean).join('\n')

    const url = tel
      ? `https://wa.me/54${tel}?text=${encodeURIComponent(partes)}`
      : `https://wa.me/?text=${encodeURIComponent(partes)}`
    window.open(url, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div className="text-white font-black text-xl">¡Venta registrada!</div>
          <div className="text-white/80 text-sm mt-1">Ticket #{venta.nro}</div>
        </div>

        {/* Resumen */}
        <div className="p-5">
          <div className="bg-slate-50 rounded-2xl p-4 mb-4 space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-200">
              <span className="flex-1">Producto</span>
              <span className="w-8 text-center">Cant</span>
              <span className="w-20 text-right">Subtotal</span>
            </div>
            {venta.items.map(i => (
              <div key={i.id} className="flex items-center text-sm">
                <span className="text-slate-600 truncate flex-1 mr-2">{i.nombre}</span>
                <span className="w-8 text-center text-slate-400 text-xs">{i.cantidad}</span>
                <span className="w-20 text-right font-semibold text-slate-800">{formatCurrency(i.precio * i.cantidad)}</span>
              </div>
            ))}
            <div className="border-t border-slate-200 pt-2 mt-1 space-y-1">
              {venta.descuentoMonto > 0 && (
                <div className="flex justify-between text-sm text-red-500">
                  <span>Descuento</span><span>-{formatCurrency(venta.descuentoMonto)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-slate-400">
                <span>Neto sin IVA</span><span>{formatCurrency(neto)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>IVA 21%</span><span>{formatCurrency(iva)}</span>
              </div>
            </div>
            <div className="flex justify-between font-black text-slate-900 border-t border-slate-200 pt-2 mt-1">
              <span>TOTAL</span>
              <span className="text-indigo-600 text-lg">{formatCurrency(venta.total)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400 pt-1">
              <span>Forma de pago</span>
              <span className="capitalize font-medium">{venta.metodoPago}</span>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Número WhatsApp del cliente (opcional)</label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={telWhatsapp}
                onChange={e => setTelWhatsapp(e.target.value)}
                placeholder="Ej: 3415001234"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Acciones */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button onClick={imprimir}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all">
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
            <button onClick={enviarWhatsapp}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{ background: '#25D366' }}>
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
          </div>

          <button onClick={onNueva}
            className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            Nueva venta
          </button>
        </div>
      </div>

      {/* Ticket oculto para impresión */}
      <TicketPrint venta={venta} comercioNombre={comercioNombre} comercioDir={comercioDir} comercioCuit={comercioCuit} />
    </div>
  )
}

export default function VentasPage() {
  const { productos, ajustarStock } = useProductos()
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [descuento, setDescuento] = useState(0)
  const [ventaConfirmada, setVentaConfirmada] = useState<VentaConfirmada | null>(null)
  const nroTicketRef = useRef(1)

  const COMERCIO_NOMBRE = 'Mi Comercio'
  const COMERCIO_DIR = 'Av. San Martín 1234, Local 5'
  const COMERCIO_CUIT = '20-12345678-9'

  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) || p.codigo.toLowerCase().includes(search.toLowerCase())
  )

  function addToCart(prod: { id: string; nombre: string; precio: number; stock: number }) {
    setCart(c => {
      const existing = c.find(i => i.id === prod.id)
      const cantActual = existing ? existing.cantidad : 0
      if (cantActual >= prod.stock) return c // no superar stock
      if (existing) return c.map(i => i.id === prod.id ? { ...i, cantidad: i.cantidad + 1 } : i)
      return [...c, { id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: 1 }]
    })
  }

  function updateQty(id: string, delta: number) {
    const prod = productos.find(p => p.id === id)
    setCart(c => c.map(i => {
      if (i.id !== id) return i
      const nueva = Math.max(1, i.cantidad + delta)
      if (prod && nueva > prod.stock) return i // no superar stock
      return { ...i, cantidad: nueva }
    }))
  }

  function removeFromCart(id: string) {
    setCart(c => c.filter(i => i.id !== id))
  }

  const subtotal = cart.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
  const descuentoMonto = subtotal * (descuento / 100)
  const total = subtotal - descuentoMonto

  function confirmarVenta() {
    if (cart.length === 0) return
    // Descontar stock de cada ítem vendido
    cart.forEach(item => ajustarStock(item.id, -item.cantidad))
    const nro = String(nroTicketRef.current).padStart(6, '0')
    nroTicketRef.current++
    setVentaConfirmada({ nro, items: [...cart], subtotal, descuentoMonto, total, metodoPago, fecha: new Date() })
  }

  function nuevaVenta() {
    setVentaConfirmada(null)
    setCart([])
    setDescuento(0)
    setMetodoPago('efectivo')
  }

  return (
    <>
      {/* CSS de impresión */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #ticket-print { display: block !important; }
        }
      `}</style>

      <div className="space-y-4">
        <h1 className="text-2xl font-black text-slate-900">Punto de Venta</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-160px)]">
          {/* CATÁLOGO */}
          <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar producto o escanear código..." className="bg-transparent flex-1 text-sm text-slate-700 outline-none" />
            </div>
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 content-start">
              {filtrados.map(p => {
                const sinStock = p.stock <= 0
                return (
                  <button key={p.id} onClick={() => !sinStock && addToCart(p)} disabled={sinStock}
                    className={`bg-white rounded-2xl p-4 border shadow-sm text-left transition-all ${sinStock ? 'opacity-50 cursor-not-allowed border-slate-100' : 'hover:shadow-md hover:border-indigo-200 active:scale-95 border-slate-100'}`}>
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                      <Package className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="text-xs text-slate-400 font-mono mb-0.5">{p.codigo}</div>
                    <div className="text-sm font-semibold text-slate-800 leading-tight mb-2">{p.nombre}</div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-indigo-600">{formatCurrency(p.precio)}</span>
                      <span className={`text-xs font-semibold ${p.stock <= 0 ? 'text-red-500' : p.estado === 'critico' ? 'text-amber-500' : 'text-slate-400'}`}>
                        {p.stock <= 0 ? 'Sin stock' : `Stock: ${p.stock}`}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* TICKET */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-500" />
                Ticket actual
                {cart.length > 0 && <span className="ml-auto text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">{cart.length}</span>}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 py-8">
                  <ShoppingCart className="w-12 h-12 mb-2" />
                  <p className="text-sm">Seleccioná productos</p>
                </div>
              ) : cart.map(item => (
                <div key={item.id} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-800 truncate">{item.nombre}</div>
                    <div className="text-xs text-slate-500">{formatCurrency(item.precio)} c/u</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-lg bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{item.cantidad}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-lg bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-sm font-bold text-slate-900 w-16 text-right">{formatCurrency(item.precio * item.cantidad)}</div>
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 flex-shrink-0">Descuento</span>
                <input type="number" value={descuento} onChange={e => setDescuento(Number(e.target.value))} min={0} max={100}
                  className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-sm text-right focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                <span className="text-sm text-slate-400">%</span>
                {descuentoMonto > 0 && <span className="ml-auto text-sm text-red-500 font-semibold">-{formatCurrency(descuentoMonto)}</span>}
              </div>
              <div className="flex items-center justify-between py-2 border-t border-slate-100">
                <span className="font-bold text-slate-900">TOTAL</span>
                <span className="text-2xl font-black text-indigo-600">{formatCurrency(total)}</span>
              </div>

              <div className="grid grid-cols-5 gap-1">
                {METODOS_PAGO.map(m => (
                  <button key={m.id} onClick={() => setMetodoPago(m.id)}
                    className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl border transition-all ${metodoPago === m.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <m.icon className={`w-4 h-4 ${metodoPago === m.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className={`text-[9px] font-semibold ${metodoPago === m.id ? 'text-indigo-600' : 'text-slate-400'}`}>{m.label}</span>
                  </button>
                ))}
              </div>

              <button onClick={confirmarVenta} disabled={cart.length === 0}
                className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                <CheckCircle className="w-4 h-4" />
                Confirmar venta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL POST-VENTA */}
      {ventaConfirmada && (
        <ModalVenta
          venta={ventaConfirmada}
          onNueva={nuevaVenta}
          comercioNombre={COMERCIO_NOMBRE}
          comercioDir={COMERCIO_DIR}
          comercioCuit={COMERCIO_CUIT}
        />
      )}
    </>
  )
}
