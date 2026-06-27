import { NextResponse, type NextRequest } from 'next/server'

// Auth is handled client-side via PIN + sessionStorage.
// This middleware is a passthrough until Supabase auth is integrated.
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
