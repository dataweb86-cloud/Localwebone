'use client'
import { useState } from 'react'
import { Plus, Edit, Trash2, X, Save, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useSesion, ROL_CONFIG, type Rol, type EmpleadoSesion } from '@/lib/store/sesion'

const ROLES: Rol[] = ['dueno', 'encargado', 'cajero', 'vendedor']

const CARGOS = [
  'Dueño / Propietario', 'Gerente', 'Encargado de turno', 'Cajero',
  'Vendedor', 'Repositor', 'Administrativo', 'Delivery', 'Otro',
]

type FormEmp = Omit<EmpleadoSesion, 'id'>
const emptyForm: FormEmp = { nombre: '', cargo: 'Cajero', rol: 'cajero', pin: '', activo: true }

function ModalEmpleado({ titulo, form, onChange, onGuardar, onCerrar, esDueno }: {
  titulo: string; form: FormEmp; onChange: (f: FormEmp) => void
  onGuardar: () => void; onCerrar: () => void; esDueno: boolean
}) {
  const [showPin, setShowPin] = useState(false)
  const [pinConfirm, setPinConfirm] = useState('')
  const esEdicion = titulo.startsWith('Editar')
  const valido = form.nombre.trim() && form.pin.length >= 4 && (esEdicion || form.pin === pinConfirm)

  function set<K extends keyof FormEmp>(k: K, v: FormEmp[K]) { onChange({ ...form, [k]: v }) }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">{titulo}</h2>
          <button onClick={onCerrar} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nombre *</label>
            <input value={form.nombre} onChange={e => set('nombre', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Nombre del empleado" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Cargo</label>
            <select value={form.cargo} onChange={e => set('cargo', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {CARGOS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Rol / Permisos *</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.filter(r => esDueno || r !== 'dueno').map(r => {
                const cfg = ROL_CONFIG[r]
                return (
                  <button key={r} onClick={() => set('rol', r)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${form.rol === r ? `border-indigo-500 ${cfg.bg}` : 'border-slate-200 hover:border-slate-300'}`}>
                    <ShieldCheck className={`w-4 h-4 flex-shrink-0 ${form.rol === r ? cfg.color : 'text-slate-400'}`} />
                    <div>
                      <div className={`text-xs font-bold ${form.rol === r ? cfg.color : 'text-slate-700'}`}>{cfg.label}</div>
                      <div className="text-[10px] text-slate-400">
                        {r === 'dueno' && 'Acceso total'}{r === 'encargado' && 'Todo menos config'}
                        {r === 'cajero' && 'Ventas + caja'}{r === 'vendedor' && 'Solo ventas'}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Accede a</div>
            <div className="flex flex-wrap gap-1">
              {ROL_CONFIG[form.rol].secciones.map(s => (
                <span key={s} className="text-[10px] bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full">
                  {s === '/' ? 'Dashboard' : s.slice(1).charAt(0).toUpperCase() + s.slice(2)}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">PIN de acceso (4-6 dígitos) *</label>
            <div className="relative">
              <input type={showPin ? 'text' : 'password'} value={form.pin}
                onChange={e => { if (/^\d*$/.test(e.target.value) && e.target.value.length <= 6) set('pin', e.target.value) }}
                className="w-full px-3 py-2.5 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tracking-widest"
                placeholder="••••" maxLength={6} />
              <button type="button" onClick={() => setShowPin(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {!esEdicion && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Confirmar PIN</label>
              <input type={showPin ? 'text' : 'password'} value={pinConfirm}
                onChange={e => { if (/^\d*$/.test(e.target.value) && e.target.value.length <= 6) setPinConfirm(e.target.value) }}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tracking-widest ${pinConfirm && form.pin !== pinConfirm ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                placeholder="••••" maxLength={6} />
              {pinConfirm && form.pin !== pinConfirm && <p className="text-xs text-red-500 mt-1">Los PINs no coinciden</p>}
            </div>
          )}
        </div>
        <div className="p-6 border-t border-slate-100 flex gap-3">
          <button onClick={onCerrar} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancelar</button>
          <button onClick={onGuardar} disabled={!valido}
            className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Save className="w-4 h-4" /> Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EmpleadosPage() {
  const { empleados, agregarEmpleado, editarEmpleado, eliminarEmpleado, sesionActual } = useSesion()
  const [showNuevo, setShowNuevo] = useState(false)
  const [formNuevo, setFormNuevo] = useState<FormEmp>(emptyForm)
  const [editando, setEditando] = useState<EmpleadoSesion | null>(null)
  const [formEdit, setFormEdit] = useState<FormEmp>(emptyForm)
  const [eliminando, setEliminando] = useState<EmpleadoSesion | null>(null)

  const esDueno = sesionActual?.rol === 'dueno'

  function abrirEditar(e: EmpleadoSesion) {
    setEditando(e)
    setFormEdit({ nombre: e.nombre, cargo: e.cargo, rol: e.rol, pin: e.pin, activo: e.activo })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Empleados</h1>
          <p className="text-slate-500 text-sm">{empleados.length} empleado{empleados.length !== 1 ? 's' : ''} registrado{empleados.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setFormNuevo(emptyForm); setShowNuevo(true) }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
          <Plus className="w-4 h-4" /> Nuevo empleado
        </button>
      </div>

      {/* resumen roles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ROLES.map(r => {
          const cfg = ROL_CONFIG[r]
          const cant = empleados.filter(e => e.rol === r && e.activo).length
          return (
            <div key={r} className={`rounded-2xl p-4 ${cfg.bg}`}>
              <div className={`text-2xl font-black ${cfg.color}`}>{cant}</div>
              <div className={`text-xs font-semibold mt-0.5 ${cfg.color} opacity-80`}>{cfg.label}{cant !== 1 ? 's' : ''}</div>
            </div>
          )
        })}
      </div>

      {/* tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {empleados.map(e => {
          const cfg = ROL_CONFIG[e.rol]
          const esMiPerfil = sesionActual?.id === e.id
          return (
            <div key={e.id} className={`bg-white border rounded-2xl shadow-sm p-4 ${!e.activo ? 'opacity-60 border-slate-200' : 'border-slate-100'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-2xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-2xl font-black ${cfg.color}`}>{e.nombre[0].toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 truncate">{e.nombre}</span>
                    {esMiPerfil && <span className="text-[10px] bg-indigo-100 text-indigo-600 font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">Yo</span>}
                  </div>
                  <div className="text-xs text-slate-400">{e.cargo}</div>
                </div>
                <span className={`flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
              </div>

              <div className="bg-slate-50 rounded-xl p-2.5 mb-3">
                <div className="flex flex-wrap gap-1">
                  {cfg.secciones.slice(0, 6).map(s => (
                    <span key={s} className="text-[10px] bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full">
                      {s === '/' ? 'Dashboard' : s.slice(1).charAt(0).toUpperCase() + s.slice(2)}
                    </span>
                  ))}
                  {cfg.secciones.length > 6 && <span className="text-[10px] text-slate-400 self-center">+{cfg.secciones.length - 6}</span>}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className={`w-2 h-2 rounded-full ${e.activo ? 'bg-green-500' : 'bg-slate-300'}`} />
                  {e.activo ? 'Activo' : 'Inactivo'}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => abrirEditar(e)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  {!esMiPerfil && (
                    <button onClick={() => setEliminando(e)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {showNuevo && (
        <ModalEmpleado titulo="Nuevo empleado" form={formNuevo} onChange={setFormNuevo} esDueno={esDueno}
          onGuardar={() => { agregarEmpleado(formNuevo); setShowNuevo(false) }} onCerrar={() => setShowNuevo(false)} />
      )}
      {editando && (
        <ModalEmpleado titulo={`Editar: ${editando.nombre}`} form={formEdit} onChange={setFormEdit} esDueno={esDueno}
          onGuardar={() => { editarEmpleado(editando.id, formEdit); setEditando(null) }} onCerrar={() => setEditando(null)} />
      )}
      {eliminando && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="font-black text-slate-900 text-lg mb-2">¿Eliminar empleado?</h3>
            <p className="text-slate-500 text-sm mb-6">Se eliminará <strong>{eliminando.nombre}</strong> y no podrá volver a ingresar.</p>
            <div className="flex gap-3">
              <button onClick={() => setEliminando(null)} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm">Cancelar</button>
              <button onClick={() => { eliminarEmpleado(eliminando.id); setEliminando(null) }} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
