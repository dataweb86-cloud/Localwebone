'use client'
import { useState } from 'react'
import { Receipt, Lock, Unlock, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, CheckCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

const movimientos = [
  { id: '1', tipo: 'ingreso', descripcion: 'Venta #00234', monto: 3450, hora: '14:32', metodo: 'Efectivo' },
  { id: '2', tipo: 'ingreso', descripcion: 'Venta #00233', monto: 8920, hora: '14:15', metodo: 'Débito' },
  { id: '3', tipo: 'egreso', descripcion: 'Pago proveedor', monto: 15000, hora: '12:00', metodo: 'Transferencia' },
  { id: '4', tipo: 'ingreso', descripcion: 'Venta #00232', monto: 1200, hora: '11:58', metodo: 'Crédito' },
  { id: '5', tipo: 'ingreso', descripcion: 'Venta #00231', monto: 5670, hora: '11:40', metodo: 'Efectivo' },
  { id: '6', tipo: 'egreso', descripcion: 'Gasto operativo', monto: 2500, hora: '10:30', metodo: 'Efectivo' },
]

export default function CajaPage() {
  const [cajaAbierta, setCajaAbierta] = useState(true)
  const [montoApertura] = useState(10000)
  const [showCierre, setShowCierre] = useState(false)
  const [efectivoContado, setEfectivoContado] = useState('')

  const totalIngresos = movimientos.filter(m => m.tipo === 'ingreso').reduce((a, m) => a + m.monto, 0)
  const totalEgresos = movimientos.filter(m => m.tipo === 'egreso').reduce((a, m) => a + m.monto, 0)
  const saldoActual = montoApertura + totalIngresos - totalEgresos

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Caja Diaria</h1>
          <p className="text-slate-500 text-sm">{formatDate(new Date())} · {cajaAbierta ? 'Caja abierta' : 'Caja cerrada'}</p>
        </div>
        {cajaAbierta ? (
          <button onClick={() => setShowCierre(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm bg-red-500 hover:bg-red-600 transition-all">
            <Lock className="w-4 h-4" /> Cerrar caja
          </button>
        ) : (
          <button onClick={() => setCajaAbierta(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm bg-green-500 hover:bg-green-600 transition-all">
            <Unlock className="w-4 h-4" /> Abrir caja
          </button>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Saldo actual', value: saldoActual, icon: DollarSign, color: 'bg-indigo-500' },
          { label: 'Total ingresos', value: totalIngresos, icon: TrendingUp, color: 'bg-green-500' },
          { label: 'Total egresos', value: totalEgresos, icon: TrendingDown, color: 'bg-red-500' },
          { label: 'Monto apertura', value: montoApertura, icon: Receipt, color: 'bg-slate-500' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 ${k.color} rounded-xl flex items-center justify-center mb-3`}>
              <k.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-black text-slate-900">{formatCurrency(k.value)}</div>
            <div className="text-xs text-slate-500 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* MOVIMIENTOS */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Movimientos del día</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {movimientos.map(m => (
            <div key={m.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${m.tipo === 'ingreso' ? 'bg-green-50' : 'bg-red-50'}`}>
                {m.tipo === 'ingreso'
                  ? <ArrowUpRight className="w-4 h-4 text-green-600" />
                  : <ArrowDownLeft className="w-4 h-4 text-red-500" />
                }
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-800">{m.descripcion}</div>
                <div className="text-xs text-slate-400">{m.hora} · {m.metodo}</div>
              </div>
              <div className={`text-sm font-bold ${m.tipo === 'ingreso' ? 'text-green-600' : 'text-red-500'}`}>
                {m.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(m.monto)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL CIERRE */}
      {showCierre && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-slate-900 mb-1">Cierre de caja</h2>
            <p className="text-slate-500 text-sm mb-6">Verificá el efectivo en caja antes de cerrar</p>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Saldo esperado', value: formatCurrency(saldoActual) },
                { label: 'Total ventas efectivo', value: formatCurrency(9120) },
                { label: 'Total egresos efectivo', value: formatCurrency(2500) },
              ].map(r => (
                <div key={r.label} className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">{r.label}</span>
                  <span className="text-sm font-bold text-slate-900">{r.value}</span>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Efectivo contado en caja</label>
              <input type="number" value={efectivoContado} onChange={e => setEfectivoContado(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-2xl font-bold"
                placeholder="$0" />
              {efectivoContado && (
                <div className={`mt-2 text-sm font-semibold ${Number(efectivoContado) >= 16620 ? 'text-green-600' : 'text-red-500'}`}>
                  Diferencia: {formatCurrency(Number(efectivoContado) - 16620)}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCierre(false)} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm">Cancelar</button>
              <button onClick={() => { setCajaAbierta(false); setShowCierre(false) }}
                className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 transition-all">
                <Lock className="w-4 h-4" /> Cerrar caja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
