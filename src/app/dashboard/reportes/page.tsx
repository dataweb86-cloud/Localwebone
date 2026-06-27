'use client'
import { useState } from 'react'
import { BarChart2, TrendingUp, ShoppingCart, Package, DollarSign, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const ventasMes = [
  { dia: '01', monto: 45000 }, { dia: '02', monto: 62000 }, { dia: '03', monto: 38000 },
  { dia: '04', monto: 71000 }, { dia: '05', monto: 85000 }, { dia: '06', monto: 92000 },
  { dia: '07', monto: 54000 }, { dia: '08', monto: 48000 }, { dia: '09', monto: 67000 },
  { dia: '10', monto: 78000 }, { dia: '11', monto: 89000 }, { dia: '12', monto: 95000 },
  { dia: '13', monto: 73000 }, { dia: '14', monto: 58000 }, { dia: '15', monto: 82000 },
]

const topProductos = [
  { nombre: 'Yerba Mate 1kg', unidades: 342, total: 1299600 },
  { nombre: 'Aceite Girasol 1L', unidades: 289, total: 534650 },
  { nombre: 'Arroz Largo Fino 1kg', unidades: 267, total: 320400 },
  { nombre: 'Azúcar Blanca 1kg', unidades: 201, total: 221100 },
  { nombre: 'Detergente 750ml', unidades: 178, total: 391600 },
]

const maxMonto = Math.max(...ventasMes.map(v => v.monto))

export default function ReportesPage() {
  const [periodo, setPeriodo] = useState<'semana' | 'mes' | 'anio'>('mes')

  const totalVentas = ventasMes.reduce((a, v) => a + v.monto, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Reportes</h1>
          <p className="text-slate-500 text-sm">Análisis de ventas y rendimiento</p>
        </div>
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
          {(['semana', 'mes', 'anio'] as const).map(p => (
            <button key={p} onClick={() => setPeriodo(p)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${periodo === p ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
              {p === 'semana' ? 'Semana' : p === 'mes' ? 'Mes' : 'Año'}
            </button>
          ))}
        </div>
      </div>

      {/* RESUMEN */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ventas totales', value: formatCurrency(totalVentas), icon: DollarSign, color: 'bg-indigo-500' },
          { label: 'Tickets emitidos', value: '1.247', icon: ShoppingCart, color: 'bg-cyan-500' },
          { label: 'Ticket promedio', value: formatCurrency(totalVentas / 1247), icon: TrendingUp, color: 'bg-violet-500' },
          { label: 'Productos vendidos', value: '4.892', icon: Package, color: 'bg-emerald-500' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 ${k.color} rounded-xl flex items-center justify-center mb-3`}>
              <k.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-black text-slate-900">{k.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRÁFICO VENTAS */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-500" /> Ventas por día
          </h2>
          <div className="flex items-end gap-1 h-40">
            {ventasMes.map(v => (
              <div key={v.dia} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full rounded-t-lg cursor-pointer transition-all group-hover:opacity-80"
                  style={{ height: `${(v.monto / maxMonto) * 144}px`, background: 'linear-gradient(180deg, #6366f1, #818cf8)' }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {formatCurrency(v.monto)}
                  </div>
                </div>
                <span className="text-xs text-slate-400">{v.dia}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TOP PRODUCTOS */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" /> Top productos
          </h2>
          <div className="space-y-3">
            {topProductos.map((p, i) => (
              <div key={p.nombre}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-4">#{i + 1}</span>
                    <span className="text-sm font-medium text-slate-800 truncate max-w-32">{p.nombre}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600">{p.unidades} uds.</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{ width: `${(p.unidades / topProductos[0].unidades) * 100}%`, background: 'linear-gradient(90deg, #6366f1, #818cf8)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
