import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LocalWeb One — Sistema de Gestión Comercial',
  description: 'Plataforma SaaS para gestión integral de comercios: ventas, stock, empleados, publicidad y más.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
