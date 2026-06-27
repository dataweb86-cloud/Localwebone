'use client'
import { useState } from 'react'
import { Store, Delete, LogIn, ChevronLeft } from 'lucide-react'
import { useSesion, ROL_CONFIG, type EmpleadoSesion } from '@/lib/store/sesion'

export default function PantallaPIN() {
  const { empleados, iniciarSesion } = useSesion()
  const [seleccionado, setSeleccionado] = useState<EmpleadoSesion | null>(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const activos = empleados.filter(e => e.activo)

  function presionarDigito(d: string) {
    if (pin.length >= 6) return
    setPin(p => p + d)
    setError('')
  }

  function borrar() { setPin(p => p.slice(0, -1)); setError('') }

  function ingresar() {
    if (!seleccionado) return
    const ok = iniciarSesion(seleccionado.id, pin)
    if (!ok) { setError('PIN incorrecto'); setPin('') }
  }

  function seleccionar(e: EmpleadoSesion) {
    setSeleccionado(e)
    setPin('')
    setError('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
      <div className="w-full max-w-sm">
        {/* logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Store className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-2xl">LocalWeb <span className="text-indigo-400">One</span></span>
        </div>

        {!seleccionado ? (
          /* selección de empleado */
          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-black text-slate-900 mb-1">¿Quién sos?</h2>
            <p className="text-slate-400 text-sm mb-5">Seleccioná tu perfil para ingresar</p>
            <div className="space-y-2">
              {activos.map(e => {
                const cfg = ROL_CONFIG[e.rol]
                return (
                  <button key={e.id} onClick={() => seleccionar(e)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group">
                    <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                      <span className={`text-lg font-black ${cfg.color}`}>{e.nombre[0].toUpperCase()}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-slate-900">{e.nombre}</div>
                      <div className="text-xs text-slate-400">{e.cargo || cfg.label}</div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          /* ingreso de PIN */
          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <button onClick={() => { setSeleccionado(null); setPin('') }}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-sm mb-5 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Cambiar usuario
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl ${ROL_CONFIG[seleccionado.rol].bg} flex items-center justify-center`}>
                <span className={`text-xl font-black ${ROL_CONFIG[seleccionado.rol].color}`}>{seleccionado.nombre[0].toUpperCase()}</span>
              </div>
              <div>
                <div className="font-black text-slate-900">{seleccionado.nombre}</div>
                <div className="text-xs text-slate-400">{seleccionado.cargo || ROL_CONFIG[seleccionado.rol].label}</div>
              </div>
            </div>

            <p className="text-center text-sm font-semibold text-slate-600 mb-3">Ingresá tu PIN</p>

            {/* puntos PIN */}
            <div className="flex justify-center gap-3 mb-2">
              {Array.from({ length: Math.max(4, pin.length + (pin.length < 6 ? 1 : 0)) }).map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full transition-all ${i < pin.length ? 'bg-indigo-600 scale-110' : 'bg-slate-200'}`} />
              ))}
            </div>

            {error && <p className="text-center text-red-500 text-xs font-semibold mb-3">{error}</p>}
            {!error && <div className="mb-3 h-4" />}

            {/* teclado numérico */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, i) => (
                d === '' ? <div key={i} /> :
                d === '⌫' ? (
                  <button key={i} onClick={borrar}
                    className="h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 active:scale-95 transition-all">
                    <Delete className="w-5 h-5" />
                  </button>
                ) : (
                  <button key={i} onClick={() => presionarDigito(d)}
                    className="h-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 font-bold text-xl hover:bg-indigo-50 hover:border-indigo-200 active:scale-95 transition-all">
                    {d}
                  </button>
                )
              ))}
            </div>

            <button onClick={ingresar} disabled={pin.length < 1}
              className="w-full py-3 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-40 transition-all"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              <LogIn className="w-4 h-4" /> Ingresar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
