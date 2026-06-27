'use client'
import { useState } from 'react'
import {
  Store, Users, DollarSign, AlertTriangle, TrendingUp, Bell,
  Search, CheckCircle, XCircle, Clock, ChevronRight, Shield
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'

const comercios = [
  { id: '1', nombre: 'Supermercado El Sol', email: 'elsol@mail.com', plan: 'profesional', status: 'activo', vencimiento: '2026-07-15', monto: 100000, tipo: 'minorista', empleados: 8, productos: 1247 },
  { id: '2', nombre: 'Ferretería El Tornillo', email: 'tornillo@mail.com', plan: 'basico', status: 'activo', vencimiento: '2026-07-02', monto: 70000, tipo: 'minorista', empleados: 3, productos: 342 },
  { id: '3', nombre: 'Distribuidora Norte', email: 'norte@mail.com', plan: 'enterprise', status: 'activo', vencimiento: '2026-07-20', monto: 120000, tipo: 'mayorista', empleados: 22, productos: 8910 },
  { id: '4', nombre: 'Ropa & Style', email: 'style@mail.com', plan: 'profesional', status: 'vencido', vencimiento: '2026-06-20', monto: 100000, tipo: 'minorista', empleados: 5, productos: 890 },
  { id: '5', nombre: 'Panadería La Esquina', email: 'esquina@mail.com', plan: 'basico', status: 'prueba', vencimiento: '2026-07-10', monto: 0, tipo: 'gastronomia', empleados: 2, productos: 89 },
]

const PLAN_COLOR: Record<string, string> = {
  basico: 'bg-slate-100 text-slate-700',
  profesional: 'bg-indigo-100 text-indigo-700',
  enterprise: 'bg-violet-100 text-violet-700',
}

const STATUS_CONFIG: Record<string, { label: string; class: string; icon: typeof CheckCircle }> = {
  activo: { label: 'Activo', class: 'bg-green-50 text-green-700', icon: CheckCircle },
  vencido: { label: 'Vencido', class: 'bg-red-50 text-red-600', icon: XCircle },
  prueba: { label: 'Prueba', class: 'bg-amber-50 text-amber-700', icon: Clock },
  suspendido: { label: 'Suspendido', class: 'bg-slate-100 text-slate-500', icon: XCircle },
}

export default function SuperAdminPage() {
  const [search, setSearch] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')

  const filtrados = comercios.filter(c => {
    const matchSearch = c.nombre.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filtroStatus === 'todos' || c.status === filtroStatus
    return matchSearch && matchStatus
  })

  const totalMRR = comercios.filter(c => c.status === 'activo').reduce((a, c) => a + c.monto, 0)
  const vencenEstaSemana = comercios.filter(c => {
    const venc = new Date(c.vencimiento)
    const hoy = new Date()
    const diff = (venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 7
  }).length

  return (
    <div className="min-h-screen" style={{ background: '#0f172a' }}>
      {/* NAVBAR */}
      <nav className="border-b border-white/10 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold">LocalWeb One <span className="text-indigo-400 text-sm font-normal">Super Admin</span></span>
        </div>
        <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">← Panel comercio</Link>
      </nav>

      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white">Panel de Super Administración</h1>
          <p className="text-slate-400 text-sm">Control total de comercios, planes y suscripciones</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Comercios activos', value: comercios.filter(c => c.status === 'activo').length, icon: Store, color: 'bg-indigo-500' },
            { label: 'MRR mensual', value: formatCurrency(totalMRR), icon: DollarSign, color: 'bg-emerald-500' },
            { label: 'Vencen esta semana', value: vencenEstaSemana, icon: AlertTriangle, color: 'bg-amber-500', alert: vencenEstaSemana > 0 },
            { label: 'Total suscriptores', value: comercios.length, icon: Users, color: 'bg-violet-500' },
          ].map(k => (
            <div key={k.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className={`w-10 h-10 ${k.color} rounded-xl flex items-center justify-center mb-3`}>
                <k.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-black text-white">{k.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{k.label}</div>
            </div>
          ))}
        </div>

        {/* ALERTAS */}
        {vencenEstaSemana > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-amber-400 font-semibold text-sm">{vencenEstaSemana} comercio{vencenEstaSemana > 1 ? 's' : ''} vence{vencenEstaSemana > 1 ? 'n' : ''} esta semana</div>
              <div className="text-amber-400/70 text-xs mt-0.5">Revisá la tabla abajo para contactarlos</div>
            </div>
          </div>
        )}

        {/* FILTROS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl">
            <Search className="w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar comercio o email..." className="bg-transparent flex-1 text-sm text-slate-300 outline-none placeholder-slate-500" />
          </div>
          <div className="flex gap-2">
            {['todos', 'activo', 'prueba', 'vencido'].map(s => (
              <button key={s} onClick={() => setFiltroStatus(s)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${filtroStatus === s ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'}`}>
                {s === 'todos' ? 'Todos' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* TABLA COMERCIOS */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Comercio', 'Plan', 'Estado', 'Vencimiento', 'Monto', 'Empleados', 'Productos', 'Acciones'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtrados.map(c => {
                  const statusCfg = STATUS_CONFIG[c.status]
                  const venc = new Date(c.vencimiento)
                  const hoy = new Date()
                  const diasRestantes = Math.ceil((venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
                  const urgente = diasRestantes >= 0 && diasRestantes <= 7

                  return (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <Store className="w-4 h-4 text-indigo-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{c.nombre}</div>
                            <div className="text-xs text-slate-400">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${PLAN_COLOR[c.plan]}`}>
                          {c.plan.charAt(0).toUpperCase() + c.plan.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusCfg.class}`}>
                          <statusCfg.icon className="w-3 h-3" /> {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className={`text-sm font-medium ${urgente && c.status === 'activo' ? 'text-amber-400' : 'text-slate-300'}`}>
                          {formatDate(c.vencimiento)}
                        </div>
                        {urgente && c.status === 'activo' && (
                          <div className="text-xs text-amber-400/70">Vence en {diasRestantes} día{diasRestantes !== 1 ? 's' : ''}</div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-200">{c.monto > 0 ? formatCurrency(c.monto) : <span className="text-slate-500">Prueba</span>}</td>
                      <td className="px-5 py-4 text-sm text-slate-400 text-center">{c.empleados}</td>
                      <td className="px-5 py-4 text-sm text-slate-400 text-center">{c.productos.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 text-xs font-semibold hover:bg-indigo-600/40 transition-all">
                            Gestionar
                          </button>
                          <button className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs font-semibold hover:bg-white/10 transition-all">
                            Plan
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

        {/* PANEL PLANES */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-4">Configuración de Planes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'basico', nombre: 'Básico', precio: 70000, precio6m: 63000, mp: 'https://mpago.la/2UYx1Ss', activos: comercios.filter(c => c.plan === 'basico' && c.status === 'activo').length },
              { id: 'profesional', nombre: 'Profesional', precio: 100000, precio6m: 90000, mp: 'https://mpago.la/1jFJcPw', activos: comercios.filter(c => c.plan === 'profesional' && c.status === 'activo').length },
              { id: 'enterprise', nombre: 'Enterprise', precio: 120000, precio6m: 108000, mp: 'https://mpago.la/1hefG5x', activos: comercios.filter(c => c.plan === 'enterprise' && c.status === 'activo').length },
            ].map(plan => (
              <div key={plan.id} className="bg-white/5 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-white font-semibold">{plan.nombre}</div>
                  <button className="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-400 text-xs font-semibold hover:bg-indigo-600/40 transition-all">Editar</button>
                </div>
                <div className="text-2xl font-black text-indigo-400">{formatCurrency(plan.precio)}<span className="text-sm font-normal text-slate-400">/mes</span></div>
                <div className="text-xs text-green-400 font-semibold mt-0.5">6 meses: {formatCurrency(plan.precio6m)}/mes (-10%)</div>
                <div className="text-xs text-slate-400 mt-1">{plan.activos} comercio{plan.activos !== 1 ? 's' : ''} activo{plan.activos !== 1 ? 's' : ''}</div>
                <div className="mt-2 text-xs text-slate-500 font-mono truncate">{plan.mp}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
