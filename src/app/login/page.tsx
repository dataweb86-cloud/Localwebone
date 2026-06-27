'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Store, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl || supabaseUrl.includes('your-project')) {
        throw new Error('⚙️ Supabase no está configurado. Completá las variables en .env.local con tu proyecto real.')
      }
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión'
      const esFetch = msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')
      setError(esFetch
        ? '⚙️ No se pudo conectar con Supabase. Verificá las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local'
        : msg
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl bg-indigo-500" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl bg-cyan-500" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-600">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-2xl">LocalWeb <span className="text-indigo-400">One</span></span>
          </div>
          <h1 className="text-4xl font-black text-white mb-4 leading-tight">
            Bienvenido de vuelta<br />a tu sistema
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            Gestioná tu comercio, tu stock, tus empleados y tus ventas desde cualquier dispositivo.
          </p>
          <div className="space-y-4">
            {['Acceso seguro con cifrado SSL', 'Datos en tiempo real', 'Soporte técnico disponible'].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="text-slate-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-600">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">LocalWeb One</span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-1">Iniciar sesión</h2>
          <p className="text-slate-500 text-sm mb-8">Ingresá con tu cuenta para acceder al panel</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="tu@comercio.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-12"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded" />
                Recordarme
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">¿Olvidaste tu contraseña?</a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Ingresando...</> : 'Ingresar al panel'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            ¿No tenés cuenta?{' '}
            <Link href="/registro" className="text-indigo-600 font-semibold hover:text-indigo-800">Registrate gratis</Link>
          </p>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-slate-600">← Volver al inicio</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
