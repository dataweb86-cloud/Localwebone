'use client'
import { useState } from 'react'
import { Building2, Plus, MapPin, Phone, Package, Users, CheckCircle } from 'lucide-react'

const sucursales = [
  { id: '1', nombre: 'Casa Central', direccion: 'Av. Corrientes 1234, CABA', telefono: '011-4567-8901', empleados: 5, productos: 1247, esPrincipal: true, activa: true },
  { id: '2', nombre: 'Sucursal Norte', direccion: 'Av. Cabildo 890, Palermo', telefono: '011-5678-9012', empleados: 3, productos: 892, esPrincipal: false, activa: true },
]

export default function SucursalesPage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Sucursales</h1>
          <p className="text-slate-500 text-sm">{sucursales.length} sucursales registradas</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all" style={{ background: '#6366f1' }}>
          <Plus className="w-4 h-4" /> Agregar sucursal
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sucursales.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{s.nombre}</div>
                  {s.esPrincipal && <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">Principal</span>}
                </div>
              </div>
              <span className={`w-2.5 h-2.5 rounded-full mt-1 ${s.activa ? 'bg-green-500' : 'bg-red-400'}`} />
            </div>
            <div className="space-y-2 text-sm text-slate-500 mb-4">
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />{s.direccion}</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{s.telefono}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <div><div className="font-bold text-slate-900">{s.empleados}</div><div className="text-xs text-slate-400">empleados</div></div>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-400" />
                <div><div className="font-bold text-slate-900">{s.productos.toLocaleString()}</div><div className="text-xs text-slate-400">productos</div></div>
              </div>
            </div>
            <button className="w-full mt-4 py-2.5 rounded-xl bg-slate-50 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition-all">
              Ver detalle
            </button>
          </div>
        ))}

        <button onClick={() => setShowModal(true)}
          className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <div className="text-sm font-semibold">Agregar sucursal</div>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-slate-900 mb-6">Nueva sucursal</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre de la sucursal</label>
                <input className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ej: Sucursal Centro" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Dirección</label>
                <input className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Calle y número, ciudad" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Teléfono</label>
                <input className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="011 1234-5678" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm">Cancelar</button>
              <button className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-all" style={{ background: '#6366f1' }}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
