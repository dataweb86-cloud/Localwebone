'use client'
import { useState } from 'react'
import {
  ShoppingCart, Package, Users, TrendingUp, ArrowUp, ArrowDown,
  AlertTriangle, Clock, DollarSign, BarChart2, Activity, Eye
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const stats = [
  { label: 'Ventas del día', value: 85420, prev: 72300, icon: ShoppingCart, color: 'bg-indigo-500', prefix: '$' },
  { label: 'Productos en stock', value: 1247, prev: 1260, icon: Package, color: 'bg-cyan-500', prefix: '' },
  { label: 'Empleados activos', value: 8, prev: 8, icon: Users, color: 'bg-violet-500', prefix: '' },
  { label: 'Ganancia neta', value: 23150, prev: 19800, icon: TrendingUp, color: 'bg-emerald-500', prefix: '$' },
]

const ventasRecientes = [
  { id: '#00234', cliente: 'Juan López', total: 3450, metodo: 'Efectivo', hora: '14:32', estado: 'completada' },
  { id: '#00233', cliente: 'María Pérez', total: 8920, metodo: 'Débito', hora: '14:15', estado: 'completada' },
  { id: '#00232', cliente: 'Carlos Gómez', total: 1200, metodo: 'Crédito', hora: '13:58', estado: 'completada' },
  { id: '#00231', cliente: 'Ana Torres', total: 5670, metodo: 'Transferencia', hora: '13:40', estado: 'completada' },
  { id: '#00230', cliente: 'Pedro Ríos', total: 780, metodo: 'Efectivo', hora: '13:22', estado: 'cancelada' },
]

const stockAlertas = [
  { producto: 'Aceite Girasol 1L', stock: 3, minimo: 10, color: 'text-red-600 bg-red-50' },
  { producto: 'Harina 0000 1kg', stock: 7, minimo: 15, color: 'text-amber-600 bg-amber-50' },
  { producto: 'Papel A4 Resma', stock: 2, minimo: 5, color: 'text-red-600 bg-red-50' },
  { producto: 'Azúcar Impalpable', stock: 5, minimo: 12, color: 'text-amber-600 bg-amber-50' },
]

const ventasPorHora = [
  { hora: '08', monto: 4200 },
  { hora: '09', monto: 8500 },
  { hora: '10', monto: 12300 },
  { hora: '11', monto: 9800 },
  { hora: '12', monto: 15600 },
  { hora: '13', monto: 11200 },
  { hora: '14', monto: 13900 },
  { hora: '15', monto: 9920 },
]

const maxVenta = Math.max(...ventasPorHora.map(v => v.monto))

export default function DashboardPage() {
  const [period, setPeriod] = useState<'hoy' | 'semana' | 'mes'>('hoy')

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Panel de Control</h1>
          <p className="text-slate-500 text-sm mt-0.5">Resumen del rendimiento de tu comercio</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          {(['hoy', 'semana', 'mes'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${period === p ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {p === 'hoy' ? 'Hoy' : p === 'semana' ? 'Semana' : 'Mes'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
          const diff = ((stat.value - stat.prev) / stat.prev) * 100
          const up = diff >= 0
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${up ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                  {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {Math.abs(diff).toFixed(1)}%
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {stat.prefix}{stat.value.toLocaleString('es-AR')}
              </div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* VENTAS POR HORA */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-900 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-500" /> Ventas por hora</h2>
            <span className="text-xs text-slate-400">Hoy</span>
          </div>
          <div className="flex items-end gap-1.5 h-32">
            {ventasPorHora.map(v => (
              <div key={v.hora} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                  style={{ height: `${(v.monto / maxVenta) * 112}px`, background: 'linear-gradient(180deg, #6366f1, #818cf8)' }}
                  title={`$${v.monto.toLocaleString('es-AR')}`} />
                <span className="text-xs text-slate-400">{v.hora}h</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="text-slate-500">Total acumulado hoy</span>
            <span className="font-bold text-slate-900">{formatCurrency(85420)}</span>
          </div>
        </div>

        {/* STOCK ALERTAS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Stock bajo
            </h2>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">{stockAlertas.length} alertas</span>
          </div>
          <div className="space-y-3">
            {stockAlertas.map(a => (
              <div key={a.producto} className={`flex items-center justify-between p-3 rounded-xl ${a.color}`}>
                <div>
                  <div className="text-sm font-medium text-slate-800">{a.producto}</div>
                  <div className="text-xs text-slate-500">Mín: {a.minimo} uds.</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-lg">{a.stock}</div>
                  <div className="text-xs text-slate-500">en stock</div>
                </div>
              </div>
            ))}
          </div>
          <a href="/dashboard/stock" className="mt-4 block text-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            Ver todo el stock →
          </a>
        </div>
      </div>

      {/* VENTAS RECIENTES */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-500" /> Ventas recientes</h2>
          <a href="/dashboard/ventas" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            Ver todas <Eye className="w-4 h-4" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">Ticket</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">Cliente</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">Método</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">Hora</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">Total</th>
                <th className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ventasRecientes.map(v => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono font-semibold text-indigo-600">{v.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{v.cliente}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{v.metodo}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{v.hora}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">{formatCurrency(v.total)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${v.estado === 'completada' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {v.estado === 'completada' ? 'Completada' : 'Cancelada'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
