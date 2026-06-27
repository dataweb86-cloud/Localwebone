-- LocalWeb One — Schema SQL para Supabase
-- Ejecutar en el SQL Editor de Supabase

-- COMERCIOS (tabla principal multi-tenant)
CREATE TABLE comercios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  tipo TEXT DEFAULT 'minorista',
  logo_url TEXT,
  direccion TEXT,
  telefono TEXT,
  email TEXT,
  cuit TEXT,
  plan TEXT DEFAULT 'basico' CHECK (plan IN ('basico', 'profesional', 'enterprise')),
  plan_status TEXT DEFAULT 'prueba' CHECK (plan_status IN ('activo', 'vencido', 'prueba', 'suspendido')),
  plan_vencimiento TIMESTAMPTZ,
  tiene_sucursales BOOLEAN DEFAULT false,
  modulos JSONB DEFAULT '{"ventas":true,"stock":true,"caja":true,"empleados":false,"clientes":false,"publicidad":false,"precios":false,"sucursales":false,"proveedores":false,"reportes":false}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SUCURSALES
CREATE TABLE sucursales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comercio_id UUID REFERENCES comercios(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  direccion TEXT,
  telefono TEXT,
  es_principal BOOLEAN DEFAULT false,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CATEGORIAS DE PRODUCTOS
CREATE TABLE categorias_productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comercio_id UUID REFERENCES comercios(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  color TEXT DEFAULT '#6366f1'
);

-- PRODUCTOS
CREATE TABLE productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comercio_id UUID REFERENCES comercios(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES categorias_productos(id),
  codigo TEXT NOT NULL,
  codigo_barras TEXT,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio_costo DECIMAL(12,2) DEFAULT 0,
  precio_venta DECIMAL(12,2) DEFAULT 0,
  precio_oferta DECIMAL(12,2),
  imagen_url TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(comercio_id, codigo)
);

-- STOCK POR SUCURSAL
CREATE TABLE stock (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comercio_id UUID REFERENCES comercios(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  sucursal_id UUID REFERENCES sucursales(id) ON DELETE CASCADE,
  cantidad INTEGER DEFAULT 0,
  cantidad_minima INTEGER DEFAULT 5,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(producto_id, sucursal_id)
);

-- CARGOS
CREATE TABLE cargos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comercio_id UUID REFERENCES comercios(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  permisos JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- EMPLEADOS
CREATE TABLE empleados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comercio_id UUID REFERENCES comercios(id) ON DELETE CASCADE,
  cargo_id UUID REFERENCES cargos(id),
  sucursal_id UUID REFERENCES sucursales(id),
  user_id UUID REFERENCES auth.users(id),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  dni TEXT,
  email TEXT,
  telefono TEXT,
  activo BOOLEAN DEFAULT true,
  fecha_ingreso DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CLIENTES
CREATE TABLE clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comercio_id UUID REFERENCES comercios(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  apellido TEXT,
  email TEXT,
  telefono TEXT,
  dni TEXT,
  total_compras INTEGER DEFAULT 0,
  total_gastado DECIMAL(14,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CAJAS
CREATE TABLE cajas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comercio_id UUID REFERENCES comercios(id) ON DELETE CASCADE,
  sucursal_id UUID REFERENCES sucursales(id),
  empleado_id UUID REFERENCES empleados(id),
  monto_apertura DECIMAL(12,2) NOT NULL,
  monto_cierre DECIMAL(12,2),
  monto_contado DECIMAL(12,2),
  diferencia DECIMAL(12,2),
  estado TEXT DEFAULT 'abierta' CHECK (estado IN ('abierta', 'cerrada')),
  fecha_apertura TIMESTAMPTZ DEFAULT now(),
  fecha_cierre TIMESTAMPTZ
);

-- VENTAS
CREATE TABLE ventas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comercio_id UUID REFERENCES comercios(id) ON DELETE CASCADE,
  sucursal_id UUID REFERENCES sucursales(id),
  caja_id UUID REFERENCES cajas(id),
  empleado_id UUID REFERENCES empleados(id),
  cliente_id UUID REFERENCES clientes(id),
  numero_ticket SERIAL,
  subtotal DECIMAL(12,2) NOT NULL,
  descuento_pct DECIMAL(5,2) DEFAULT 0,
  descuento_monto DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  metodo_pago TEXT DEFAULT 'efectivo',
  estado TEXT DEFAULT 'completada' CHECK (estado IN ('completada', 'cancelada', 'pendiente')),
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- DETALLE DE VENTAS
CREATE TABLE detalle_ventas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venta_id UUID REFERENCES ventas(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL
);

-- PROVEEDORES
CREATE TABLE proveedores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comercio_id UUID REFERENCES comercios(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  contacto TEXT,
  email TEXT,
  telefono TEXT,
  direccion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- MOVIMIENTOS DE CAJA
CREATE TABLE movimientos_caja (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caja_id UUID REFERENCES cajas(id) ON DELETE CASCADE,
  comercio_id UUID REFERENCES comercios(id),
  tipo TEXT CHECK (tipo IN ('ingreso', 'egreso')),
  descripcion TEXT,
  monto DECIMAL(12,2) NOT NULL,
  metodo_pago TEXT,
  referencia_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PUBLICIDADES
CREATE TABLE publicidades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comercio_id UUID REFERENCES comercios(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  plantilla TEXT,
  producto_nombre TEXT,
  precio DECIMAL(12,2),
  precio_anterior DECIMAL(12,2),
  texto TEXT,
  imagen_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SUSCRIPCIONES (para superadmin)
CREATE TABLE suscripciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comercio_id UUID REFERENCES comercios(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  fecha_inicio TIMESTAMPTZ DEFAULT now(),
  fecha_vencimiento TIMESTAMPTZ NOT NULL,
  estado TEXT DEFAULT 'activo',
  metodo_pago TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (Row Level Security)
ALTER TABLE comercios ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE empleados ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cajas ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Políticas básicas: cada usuario solo ve su comercio
CREATE POLICY "comercios_own" ON comercios FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "productos_own" ON productos FOR ALL USING (comercio_id IN (SELECT id FROM comercios WHERE user_id = auth.uid()));
CREATE POLICY "stock_own" ON stock FOR ALL USING (comercio_id IN (SELECT id FROM comercios WHERE user_id = auth.uid()));
CREATE POLICY "empleados_own" ON empleados FOR ALL USING (comercio_id IN (SELECT id FROM comercios WHERE user_id = auth.uid()));
CREATE POLICY "ventas_own" ON ventas FOR ALL USING (comercio_id IN (SELECT id FROM comercios WHERE user_id = auth.uid()));
CREATE POLICY "cajas_own" ON cajas FOR ALL USING (comercio_id IN (SELECT id FROM comercios WHERE user_id = auth.uid()));
CREATE POLICY "clientes_own" ON clientes FOR ALL USING (comercio_id IN (SELECT id FROM comercios WHERE user_id = auth.uid()));

-- Índices para rendimiento
CREATE INDEX idx_productos_comercio ON productos(comercio_id);
CREATE INDEX idx_stock_producto ON stock(producto_id);
CREATE INDEX idx_ventas_comercio_fecha ON ventas(comercio_id, created_at DESC);
CREATE INDEX idx_empleados_comercio ON empleados(comercio_id);
