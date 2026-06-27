// Ruta de demo — redirige al dashboard sin verificar auth (solo desarrollo)
import { redirect } from 'next/navigation'

export default function DemoPage() {
  redirect('/dashboard')
}
