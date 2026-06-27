export type Plan = 'basico' | 'profesional' | 'enterprise'
export type PlanStatus = 'activo' | 'vencido' | 'prueba' | 'suspendido'
export type ComercioTipo = 'minorista' | 'mayorista' | 'gastronomia' | 'servicios' | 'otro'

export interface Comercio {
  id: string
  nombre: string
  tipo: ComercioTipo
  logo_url?: string
  direccion?: string
  telefono?: string
  email: string
  cuit?: string
  plan: Plan
  plan_status: PlanStatus
  plan_vencimiento?: string
  tiene_sucursales: boolean
  modulos: ModulosConfig
  created_at: string
}

export interface ModulosConfig {
  ventas: boolean
  stock: boolean
  empleados: boolean
  publicidad: boolean
  precios: boolean
  sucursales: boolean
  caja: boolean
  clientes: boolean
  proveedores: boolean
  reportes: boolean
}

export interface Sucursal {
  id: string
  comercio_id: string
  nombre: string
  direccion: string
  telefono?: string
  es_principal: boolean
}

export interface Producto {
  id: string
  comercio_id: string
  codigo: string
  codigo_barras?: string
  nombre: string
  descripcion?: string
  categoria_id?: string
  precio_costo: number
  precio_venta: number
  precio_oferta?: number
  stock_actual: number
  stock_minimo: number
  imagen_url?: string
  activo: boolean
}

export interface Empleado {
  id: string
  comercio_id: string
  nombre: string
  apellido: string
  dni?: string
  email?: string
  telefono?: string
  cargo_id: string
  sucursal_id?: string
  activo: boolean
}

export interface Cargo {
  id: string
  comercio_id: string
  nombre: string
  permisos: string[]
}

export interface Venta {
  id: string
  comercio_id: string
  sucursal_id?: string
  empleado_id?: string
  cliente_id?: string
  total: number
  descuento: number
  metodo_pago: string
  estado: 'completada' | 'cancelada' | 'pendiente'
  created_at: string
}

export interface Plan_Info {
  id: Plan
  nombre: string
  precio: number
  descripcion: string
  modulos: string[]
  limite_productos: number
  limite_empleados: number
  limite_sucursales: number
}

export const PLANES: Plan_Info[] = [
  {
    id: 'basico',
    nombre: 'Básico',
    precio: 70000,
    descripcion: 'Ideal para emprendedores y pequeños comercios',
    modulos: ['ventas', 'stock', 'caja'],
    limite_productos: 500,
    limite_empleados: 3,
    limite_sucursales: 1,
  },
  {
    id: 'profesional',
    nombre: 'Profesional',
    precio: 100000,
    descripcion: 'Para comercios en crecimiento con múltiples necesidades',
    modulos: ['ventas', 'stock', 'caja', 'empleados', 'clientes', 'precios', 'publicidad', 'reportes'],
    limite_productos: 5000,
    limite_empleados: 20,
    limite_sucursales: 3,
  },
  {
    id: 'enterprise',
    nombre: 'Enterprise',
    precio: 120000,
    descripcion: 'Solución completa para cadenas y grandes comercios',
    modulos: ['ventas', 'stock', 'caja', 'empleados', 'clientes', 'precios', 'publicidad', 'reportes', 'sucursales', 'proveedores'],
    limite_productos: -1,
    limite_empleados: -1,
    limite_sucursales: -1,
  },
]

export const MP_LINKS: Record<Plan, string> = {
  basico: 'https://mpago.la/2UYx1Ss',
  profesional: 'https://mpago.la/1jFJcPw',
  enterprise: 'https://mpago.la/1hefG5x',
}

export const DESCUENTO_6_MESES = 10

export const CARGOS_PREDEFINIDOS = [
  'Gerente General',
  'Jefe de Ventas',
  'Jefe de Depósito',
  'Vendedor',
  'Cajero',
  'Repositor',
  'Administrativo',
  'Contador',
  'Encargado de Turno',
  'Supervisor',
  'Repartidor',
  'Promotor',
  'Atención al Cliente',
]
