'use client'
import { useState } from 'react'
import { Settings, Store, Bell, CreditCard, Shield, Globe, Palette, CheckCircle } from 'lucide-react'

const MODULOS_CONFIG = [
  { id: 'ventas', label: 'Punto de Venta (POS)', desc: 'Cobros, tickets y medios de pago' },
  { id: 'stock', label: 'Control de Stock', desc: 'Inventario y alertas automáticas' },
  { id: 'empleados', label: 'Gestión de Empleados', desc: 'Cargos, permisos y turnos' },
  { id: 'caja', label: 'Caja Diaria', desc: 'Apertura, cierre y arqueo' },
  { id: 'clientes', label: 'Cartera de Clientes', desc: 'Historial y fidelización' },
  { id: 'publicidad', label: 'Publicidad Digital', desc: 'Imágenes de ofertas y promociones' },
  { id: 'precios', label: 'Control de Precios', desc: 'Actualización masiva y listas' },
  { id: 'sucursales', label: 'Multi-Sucursal', desc: 'Varias locales, stock centralizado' },
  { id: 'proveedores', label: 'Proveedores', desc: 'Órdenes de compra y recepción' },
  { id: 'reportes', label: 'Reportes Avanzados', desc: 'Ventas, rentabilidad y gráficos' },
]

const tabs = [
  { id: 'comercio', label: 'Mi comercio', icon: Store },
  { id: 'modulos', label: 'Módulos', icon: Settings },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
  { id: 'suscripcion', label: 'Suscripción', icon: CreditCard },
  { id: 'seguridad', label: 'Seguridad', icon: Shield },
]

export default function ConfiguracionPage() {
  const [tab, setTab] = useState('comercio')
  const [modulosActivos, setModulosActivos] = useState(['ventas', 'stock', 'empleados', 'caja', 'publicidad', 'precios', 'reportes'])
  const [saved, setSaved] = useState(false)

  function toggleModulo(id: string) {
    setModulosActivos(m => m.includes(id) ? m.filter(i => i !== id) : [...m, id])
  }

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Configuración</h1>
        <p className="text-slate-500 text-sm">Personalizá tu sistema a medida de tu comercio</p>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'comercio' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-slate-900">Datos del comercio</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre del comercio</label>
              <input defaultValue="Mi Comercio" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">CUIT</label>
              <input defaultValue="20-12345678-9" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Teléfono</label>
              <input defaultValue="011 1234-5678" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email de contacto</label>
              <input defaultValue="admin@micomercio.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Dirección principal</label>
              <input defaultValue="Av. Corrientes 1234, CABA" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={save} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all" style={{ background: '#6366f1' }}>
              {saved ? <><CheckCircle className="w-4 h-4" /> Guardado</> : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}

      {tab === 'modulos' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-1">Módulos activos</h2>
          <p className="text-slate-500 text-sm mb-6">Los módulos disponibles dependen de tu plan. Activá solo los que usás.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MODULOS_CONFIG.map(m => {
              const activo = modulosActivos.includes(m.id)
              return (
                <div key={m.id} onClick={() => toggleModulo(m.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${activo ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className={`w-5 h-5 rounded-lg flex-shrink-0 flex items-center justify-center transition-all ${activo ? 'bg-indigo-600' : 'border-2 border-slate-300'}`}>
                    {activo && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${activo ? 'text-indigo-800' : 'text-slate-700'}`}>{m.label}</div>
                    <div className="text-xs text-slate-400">{m.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-end mt-6">
            <button onClick={save} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all" style={{ background: '#6366f1' }}>
              {saved ? <><CheckCircle className="w-4 h-4" /> Guardado</> : 'Guardar módulos'}
            </button>
          </div>
        </div>
      )}

      {tab === 'suscripcion' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <h2 className="font-bold text-slate-900">Tu suscripción</h2>
          <div className="flex items-center justify-between p-5 bg-indigo-50 rounded-2xl border border-indigo-200">
            <div>
              <div className="text-sm text-indigo-600 font-semibold">Plan actual</div>
              <div className="text-2xl font-black text-indigo-900">Profesional</div>
              <div className="text-sm text-indigo-600 mt-1">$100.000/mes · Vence el 15/07/2026</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-indigo-500 font-medium">Estado</div>
              <div className="flex items-center gap-1.5 text-green-600 font-bold"><span className="w-2 h-2 rounded-full bg-green-500" />Activo</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-700 mb-1">Cambiar de plan</h3>
            <p className="text-xs text-slate-400 mb-3">El pago se realiza por MercadoPago. 10% de descuento pagando 6 meses.</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'basico', nombre: 'Básico', precio: 70000, precio6m: 63000, mp: 'https://mpago.la/2UYx1Ss' },
                { id: 'profesional', nombre: 'Profesional', precio: 100000, precio6m: 90000, mp: 'https://mpago.la/1jFJcPw', actual: true },
                { id: 'enterprise', nombre: 'Enterprise', precio: 120000, precio6m: 108000, mp: 'https://mpago.la/1hefG5x' },
              ].map(p => (
                <div key={p.id} className={`p-4 rounded-xl border-2 text-center ${p.actual ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}`}>
                  <div className="font-bold text-slate-900">{p.nombre}</div>
                  <div className="text-lg font-black mt-1" style={{ color: '#6366f1' }}>${p.precio.toLocaleString('es-AR')}<span className="text-xs font-normal text-slate-400">/mes</span></div>
                  <div className="text-xs text-green-600 font-semibold mt-0.5">6m: ${p.precio6m.toLocaleString('es-AR')}/mes</div>
                  {p.actual ? (
                    <span className="inline-block mt-2 text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">Plan actual</span>
                  ) : (
                    <a href={p.mp} target="_blank" rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs bg-indigo-600 text-white px-3 py-1 rounded-full font-semibold hover:bg-indigo-700 transition-colors">
                      Contratar
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(tab === 'notificaciones' || tab === 'seguridad') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-4">{tab === 'notificaciones' ? 'Notificaciones' : 'Seguridad'}</h2>
          <p className="text-slate-400 text-sm">Esta sección estará disponible próximamente.</p>
        </div>
      )}
    </div>
  )
}
