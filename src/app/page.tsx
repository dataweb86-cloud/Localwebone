'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  BarChart3, Package, Users, ShoppingCart, Megaphone, TrendingUp,
  Shield, Zap, Globe, CheckCircle, ArrowRight, Store, Star,
  Building2, Receipt, Boxes, ChevronRight, Tag
} from 'lucide-react'

const features = [
  { icon: ShoppingCart, title: 'Punto de Venta', desc: 'POS completo con múltiples medios de pago, descuentos y comprobantes.', color: 'bg-indigo-500' },
  { icon: Package, title: 'Control de Stock', desc: 'Gestión por código de barras, manual o imagen. Alertas de stock mínimo.', color: 'bg-cyan-500' },
  { icon: Users, title: 'Empleados', desc: 'Alta, cargos personalizados, permisos por rol y control de turnos.', color: 'bg-violet-500' },
  { icon: Megaphone, title: 'Publicidad Digital', desc: 'Creá imágenes de ofertas y promociones para redes sociales.', color: 'bg-pink-500' },
  { icon: TrendingUp, title: 'Precios & Reportes', desc: 'Actualización masiva de precios, reportes de ventas y rentabilidad.', color: 'bg-amber-500' },
  { icon: Building2, title: 'Multi-Sucursal', desc: 'Administrá todas tus sucursales desde un solo panel centralizado.', color: 'bg-emerald-500' },
  { icon: Receipt, title: 'Caja Diaria', desc: 'Apertura, cierre y arqueo de caja con historial completo.', color: 'bg-blue-500' },
  { icon: Boxes, title: 'Proveedores', desc: 'Gestión de proveedores, órdenes de compra y recepción de mercadería.', color: 'bg-rose-500' },
]

const plans = [
  {
    id: 'basico', name: 'Básico', price: 70000, price6m: 63000, popular: false,
    mpLink: 'https://mpago.la/2UYx1Ss',
    desc: 'Para emprendedores y pequeños comercios',
    features: ['POS / Punto de Venta', 'Stock (500 productos)', 'Caja Diaria', '1 Sucursal', '3 Empleados', 'Soporte por email'],
  },
  {
    id: 'profesional', name: 'Profesional', price: 100000, price6m: 90000, popular: true,
    mpLink: 'https://mpago.la/1jFJcPw',
    desc: 'Para comercios en crecimiento',
    features: ['Todo lo del Básico', '5.000 productos', 'Hasta 20 Empleados', '3 Sucursales', 'Módulo de Publicidad', 'Control de Precios', 'Reportes avanzados', 'Soporte prioritario'],
  },
  {
    id: 'enterprise', name: 'Enterprise', price: 120000, price6m: 108000, popular: false,
    mpLink: 'https://mpago.la/1hefG5x',
    desc: 'Para cadenas y grandes comercios',
    features: ['Todo lo del Profesional', 'Productos y empleados ilimitados', 'Sucursales ilimitadas', 'Módulo de Proveedores', 'API de integración', 'Multi-usuario avanzado', 'Soporte 24/7 dedicado'],
  },
]

const testimonials = [
  { name: 'María González', comercio: 'Almacén Don José', text: 'Pasé de llevar el stock en papel a tenerlo todo en el celular. En 2 semanas ya lo manejo solo.', stars: 5 },
  { name: 'Carlos Ruiz', comercio: 'Ferretería El Tornillo', text: 'Las actualizaciones masivas de precios me ahorran horas cada semana. Increíble.', stars: 5 },
  { name: 'Laura Méndez', comercio: 'Ropa & Style', text: 'El módulo de publicidad es genial, armamos las ofertas del fin de semana en minutos.', stars: 5 },
]

export default function LandingPage() {
  const [ciclo, setCiclo] = useState<'mensual' | '6meses'>('mensual')

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* NAV */}
      <nav style={{ background: 'var(--sidebar-bg)' }} className="sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">LocalWeb <span style={{ color: '#a5b4fc' }}>One</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#funciones" className="text-slate-300 hover:text-white text-sm transition-colors">Funciones</a>
            <a href="#planes" className="text-slate-300 hover:text-white text-sm transition-colors">Planes</a>
            <a href="#testimonios" className="text-slate-300 hover:text-white text-sm transition-colors">Testimonios</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-slate-300 hover:text-white text-sm px-4 py-2 transition-colors">Ingresar</Link>
            <Link href="/registro" className="text-white text-sm px-5 py-2 rounded-lg font-semibold transition-all hover:opacity-90" style={{ background: 'var(--primary)' }}>
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden py-20 lg:py-32" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ background: 'var(--primary)' }} />
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ background: 'var(--accent)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
            <Zap className="w-4 h-4" />
            Sistema de gestión integral para tu comercio
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Administrá tu comercio<br />
            <span style={{ background: 'linear-gradient(90deg, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              desde cualquier lugar
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Ventas, stock, empleados, publicidad, precios y más — todo en una sola plataforma.
            Configuralo a medida de tu negocio y empezá a crecer hoy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/registro" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 shadow-2xl" style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}>
              Crear mi cuenta gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#planes" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              Ver planes y precios
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-400">Sin tarjeta de crédito · 14 días de prueba gratis · Cancelá cuando quieras</p>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: '+500', label: 'Comercios activos' },
            { val: '+50K', label: 'Productos gestionados' },
            { val: '99.9%', label: 'Uptime garantizado' },
            { val: '4.9★', label: 'Valoración promedio' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-black" style={{ color: 'var(--primary)' }}>{s.val}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="funciones" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-4">Todo lo que necesitás</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">Elegís qué módulos activar. Pagás solo por lo que usás. Escalás cuando querés.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all cursor-default">
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-4">¿Cómo funciona?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Creá tu cuenta', desc: 'Registrate en menos de 2 minutos. Sin tarjeta requerida.' },
              { step: '02', title: 'Configurá tu comercio', desc: 'Completá el formulario de onboarding con los módulos que necesitás.' },
              { step: '03', title: 'Cargá tu inventario', desc: 'Por código de barras, manual o con imagen. Importá desde Excel.' },
              { step: '04', title: 'Empezá a vender', desc: 'Tu equipo ya puede trabajar. Supervisá todo desde el panel.' },
            ].map((s, i) => (
              <div key={s.step} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}>
                  {s.step}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
                {i < 3 && <ChevronRight className="hidden md:block absolute top-6 -right-4 w-8 h-8 text-slate-200" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-4">Planes y precios</h2>
            <p className="text-xl text-slate-500 mb-8">Todos los planes incluyen 14 días de prueba gratuita</p>

            {/* TOGGLE MENSUAL / 6 MESES */}
            <div className="inline-flex items-center gap-1 p-1 bg-white rounded-2xl shadow-sm border border-slate-200">
              <button onClick={() => setCiclo('mensual')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${ciclo === 'mensual' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                Mensual
              </button>
              <button onClick={() => setCiclo('6meses')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${ciclo === '6meses' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                6 meses
                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${ciclo === '6meses' ? 'bg-white text-indigo-600' : 'bg-green-100 text-green-700'}`}>
                  -10%
                </span>
              </button>
            </div>
            {ciclo === '6meses' && (
              <p className="mt-3 text-sm text-green-600 font-semibold">
                ✓ Pagás 6 meses juntos y ahorrás 10% — transferencia directa a MercadoPago
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map(plan => {
              const precio = ciclo === '6meses' ? plan.price6m : plan.price
              const precioTachado = ciclo === '6meses' ? plan.price : null
              return (
                <div key={plan.id} className={`relative rounded-2xl p-8 flex flex-col ${plan.popular ? 'text-white shadow-2xl scale-105' : 'bg-white shadow-sm border border-slate-100'}`}
                  style={plan.popular ? { background: 'linear-gradient(135deg, #4f46e5, #0891b2)' } : {}}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-amber-400 text-amber-900 whitespace-nowrap">
                      MÁS POPULAR
                    </div>
                  )}
                  {ciclo === '6meses' && (
                    <div className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-bold ${plan.popular ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>
                      -10%
                    </div>
                  )}
                  <div className={`text-sm font-semibold mb-1 ${plan.popular ? 'text-indigo-200' : 'text-indigo-600'}`}>{plan.name}</div>
                  <div className="mb-1">
                    {precioTachado && (
                      <div className={`text-sm line-through ${plan.popular ? 'text-indigo-300' : 'text-slate-400'}`}>
                        ${precioTachado.toLocaleString('es-AR')}/mes
                      </div>
                    )}
                    <div className="text-3xl font-black">
                      ${precio.toLocaleString('es-AR')}
                      <span className={`text-sm font-normal ml-1 ${plan.popular ? 'text-indigo-200' : 'text-slate-400'}`}>/mes</span>
                    </div>
                    {ciclo === '6meses' && (
                      <div className={`text-xs mt-0.5 font-semibold ${plan.popular ? 'text-indigo-200' : 'text-green-600'}`}>
                        Total 6 meses: ${(precio * 6).toLocaleString('es-AR')}
                      </div>
                    )}
                  </div>
                  <p className={`text-sm mt-3 mb-6 ${plan.popular ? 'text-indigo-100' : 'text-slate-500'}`}>{plan.desc}</p>
                  <ul className="space-y-3 flex-1 mb-6">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.popular ? 'text-indigo-200' : 'text-indigo-500'}`} />
                        <span className={plan.popular ? 'text-indigo-50' : 'text-slate-600'}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* BOTÓN PAGO MP */}
                  <a href={plan.mpLink} target="_blank" rel="noopener noreferrer"
                    className={`w-full text-center py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2 mb-2 ${plan.popular ? 'bg-white text-indigo-600' : 'text-white'}`}
                    style={!plan.popular ? { background: '#6366f1' } : {}}>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                    </svg>
                    Pagar con MercadoPago
                  </a>
                  <Link href={`/registro?plan=${plan.id}`}
                    className={`w-full text-center py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80 ${plan.popular ? 'text-indigo-200 hover:text-white' : 'text-indigo-600 hover:text-indigo-800'}`}>
                    Registrarme primero →
                  </Link>
                </div>
              )
            })}
          </div>

          {/* NOTA PAGO */}
          <div className="mt-10 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <Tag className="w-4 h-4 text-indigo-500" />
              <p className="text-sm text-slate-600">
                El pago se realiza vía <strong>MercadoPago</strong>. Una vez acreditado, tu cuenta se activa en minutos.
                Para el plan de 6 meses se aplica el <strong>10% de descuento</strong> automáticamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="testimonios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-14 text-center">Lo que dicen nuestros clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(t => (
              <div key={t.name} className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="font-bold text-slate-900">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.comercio}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 text-indigo-400" />
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">¿Listo para dar el salto?</h2>
          <p className="text-xl text-slate-300 mb-10">14 días gratis. Sin límites. Sin tarjeta.</p>
          <Link href="/registro" className="inline-flex items-center gap-2 px-10 py-5 rounded-xl text-white font-black text-xl transition-all hover:scale-105 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}>
            Crear mi sistema ahora
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="mt-4 text-sm text-slate-500">Más de 500 comercios ya confían en LocalWeb One</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#070d1a' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#6366f1' }}>
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">LocalWeb One</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 LocalWeb One. Todos los derechos reservados.</p>
          <div className="flex gap-4 text-slate-500 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
