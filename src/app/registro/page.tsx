'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Store, Eye, EyeOff, Loader2, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { Suspense } from 'react'

const TIPOS_COMERCIO = [
  { id: 'minorista', label: 'Comercio Minorista', emoji: '🛍️' },
  { id: 'mayorista', label: 'Mayorista / Distribuidora', emoji: '🏭' },
  { id: 'gastronomia', label: 'Gastronomía / Restaurant', emoji: '🍕' },
  { id: 'servicios', label: 'Servicios', emoji: '🔧' },
  { id: 'otro', label: 'Otro', emoji: '🏪' },
]

const MODULOS = [
  { id: 'ventas', label: 'Punto de Venta (POS)', desc: 'Cobros, tickets, medios de pago' },
  { id: 'stock', label: 'Control de Stock', desc: 'Inventario, código de barras, alertas' },
  { id: 'empleados', label: 'Gestión de Empleados', desc: 'Cargos, permisos, turnos' },
  { id: 'caja', label: 'Caja Diaria', desc: 'Apertura, cierre, arqueo' },
  { id: 'clientes', label: 'Cartera de Clientes', desc: 'Historial, fidelización' },
  { id: 'publicidad', label: 'Publicidad Digital', desc: 'Imágenes de ofertas, promociones' },
  { id: 'precios', label: 'Control de Precios', desc: 'Actualización masiva, listas de precios' },
  { id: 'sucursales', label: 'Multi-Sucursal', desc: 'Varias locales, stock centralizado' },
  { id: 'proveedores', label: 'Proveedores', desc: 'Órdenes de compra, recepción' },
  { id: 'reportes', label: 'Reportes Avanzados', desc: 'Ventas, rentabilidad, gráficos' },
]

function RegistroContent() {
  const searchParams = useSearchParams()
  const planInicial = searchParams.get('plan') || 'profesional'

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    comercioNombre: '',
    comercioTipo: '',
    comercioDireccion: '',
    comercioTelefono: '',
    cuit: '',
    modulos: ['ventas', 'stock', 'caja'] as string[],
    plan: planInicial,
    tieneSucursales: false,
    cantSucursales: 1,
  })

  function toggleModulo(id: string) {
    setForm(f => ({
      ...f,
      modulos: f.modulos.includes(id) ? f.modulos.filter(m => m !== id) : [...f.modulos, id]
    }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl || supabaseUrl.includes('your-project')) {
        throw new Error('⚙️ Supabase no está configurado aún. Completá las variables en .env.local con tu proyecto real de Supabase.')
      }
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            nombre: form.nombre,
            comercio_nombre: form.comercioNombre,
            comercio_tipo: form.comercioTipo,
            plan: form.plan,
          }
        }
      })
      if (authError) throw authError
      if (data.user) {
        window.location.href = '/dashboard'
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al crear la cuenta'
      const esFetch = msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')
      setError(esFetch
        ? '⚙️ No se pudo conectar con Supabase. Verificá que las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local sean correctas.'
        : msg
      )
    } finally {
      setLoading(false)
    }
  }

  const steps = ['Tu cuenta', 'Tu comercio', 'Módulos', 'Confirmar']

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
      <div className="w-full max-w-2xl">
        {/* LOGO */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-600">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">LocalWeb <span className="text-indigo-400">One</span></span>
        </div>

        {/* STEPPER */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${i + 1 === step ? 'bg-indigo-600 text-white' : i + 1 < step ? 'bg-green-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                {i + 1 < step ? <CheckCircle className="w-3 h-3" /> : <span>{i + 1}</span>}
                <span className="hidden sm:inline">{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-6 h-px ${i + 1 < step ? 'bg-green-400' : 'bg-white/20'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">Creá tu cuenta</h2>
              <p className="text-slate-500 text-sm mb-6">14 días gratis, sin tarjeta de crédito</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tu nombre completo</label>
                  <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                    placeholder="Juan García" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="tu@email.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="Mínimo 8 caracteres" className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">Tu comercio</h2>
              <p className="text-slate-500 text-sm mb-6">Contanos sobre tu negocio para configurarlo a medida</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre del comercio</label>
                  <input value={form.comercioNombre} onChange={e => setForm(f => ({ ...f, comercioNombre: e.target.value }))}
                    placeholder="Ej: Supermercado El Sol" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de comercio</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TIPOS_COMERCIO.map(t => (
                      <button key={t.id} type="button" onClick={() => setForm(f => ({ ...f, comercioTipo: t.id }))}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${form.comercioTipo === t.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="text-xl mb-1">{t.emoji}</div>
                        <div className="text-xs font-medium text-slate-700">{t.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Teléfono</label>
                    <input value={form.comercioTelefono} onChange={e => setForm(f => ({ ...f, comercioTelefono: e.target.value }))}
                      placeholder="011 1234-5678" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">CUIT (opcional)</label>
                    <input value={form.cuit} onChange={e => setForm(f => ({ ...f, cuit: e.target.value }))}
                      placeholder="20-12345678-9" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Dirección principal</label>
                  <input value={form.comercioDireccion} onChange={e => setForm(f => ({ ...f, comercioDireccion: e.target.value }))}
                    placeholder="Av. Corrientes 1234, CABA" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <input type="checkbox" id="sucursales" checked={form.tieneSucursales}
                    onChange={e => setForm(f => ({ ...f, tieneSucursales: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600" />
                  <label htmlFor="sucursales" className="text-sm font-medium text-slate-700 cursor-pointer">Tengo múltiples sucursales</label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">¿Qué necesitás?</h2>
              <p className="text-slate-500 text-sm mb-6">Seleccioná los módulos que querés activar. Podés cambiarlos después.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MODULOS.map(m => (
                  <button key={m.id} type="button" onClick={() => toggleModulo(m.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${form.modulos.includes(m.id) ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-4 h-4 rounded mt-0.5 flex-shrink-0 flex items-center justify-center ${form.modulos.includes(m.id) ? 'bg-indigo-600' : 'border-2 border-slate-300'}`}>
                        {form.modulos.includes(m.id) && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{m.label}</div>
                        <div className="text-xs text-slate-500">{m.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">Confirmá tu registro</h2>
              <p className="text-slate-500 text-sm mb-6">Revisá los datos antes de crear tu sistema</p>
              <div className="space-y-3">
                {[
                  { label: 'Nombre', value: form.nombre },
                  { label: 'Email', value: form.email },
                  { label: 'Comercio', value: form.comercioNombre },
                  { label: 'Tipo', value: TIPOS_COMERCIO.find(t => t.id === form.comercioTipo)?.label || '-' },
                  { label: 'Módulos activos', value: `${form.modulos.length} módulos seleccionados` },
                  { label: 'Plan', value: form.plan.charAt(0).toUpperCase() + form.plan.slice(1) },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">{item.label}</span>
                    <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                <p className="text-sm text-indigo-700 font-medium">✓ 14 días de prueba gratuita incluidos</p>
                <p className="text-xs text-indigo-600 mt-1">Podés cambiar de plan o cancelar en cualquier momento</p>
              </div>
            </div>
          )}

          {/* NAV BUTTONS */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:border-slate-300 transition-all">
                <ArrowLeft className="w-4 h-4" /> Atrás
              </button>
            )}
            {step < 4 ? (
              <button onClick={() => setStep(s => s + 1)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creando tu sistema...</> : <>Crear mi sistema <ArrowRight className="w-4 h-4" /></>}
              </button>
            )}
          </div>

          <p className="mt-4 text-center text-sm text-slate-500">
            ¿Ya tenés cuenta? <Link href="/login" className="text-indigo-600 font-semibold">Iniciá sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegistroPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}><div className="text-white">Cargando...</div></div>}>
      <RegistroContent />
    </Suspense>
  )
}
