import { Metadata } from 'next'
import TiendaClient from './TiendaClient'

export const metadata: Metadata = {
  title: 'Tienda | LocalWeb One',
}

export default function TiendaPage({ params }: { params: { slug: string } }) {
  return <TiendaClient slug={params.slug} />
}
