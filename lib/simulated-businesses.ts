// ─────────────────────────────────────────────────────────────
// NEGOCIOS SIMULADOS — InsightPilot Demo Data
// Tres perfiles distintos para mostrar el sistema en acción.
// ─────────────────────────────────────────────────────────────

export interface Venta {
  fecha: string
  producto: string
  categoria: string
  cantidad: number
  precio_unitario: number
  precio_costo: number
}

export interface StockItem {
  producto: string
  categoria: string
  stock_actual: number
  stock_minimo: number
  precio_costo: number
  precio_venta: number
}

export interface CampanaMarketing {
  canal: string
  campana: string
  gasto: number
  clics: number
  conversiones: number
  ingresos_generados: number
}

export interface NegocioSimulado {
  id: string
  nombre: string
  rubro: string
  ciudad: string
  tier: 'diagnostico' | 'pro' | 'copiloto'
  avatar: string
  color: string
  ventas: Venta[]
  stock: StockItem[]
  marketing: CampanaMarketing[]
}

// ─────────────────────────────────────────────────────────────
// NEGOCIO 1: Distribuidora con dependencia crítica de producto
// Perfil: alto riesgo de concentración, quiebre inminente
// ─────────────────────────────────────────────────────────────
const distribuidoraNorte: NegocioSimulado = {
  id: 'distribuidora-norte',
  nombre: 'Distribuidora Norte',
  rubro: 'Mayorista / Distribución',
  ciudad: 'Salta',
  tier: 'copiloto',
  avatar: 'DN',
  color: '#2D42CC',

  ventas: [
    // Última semana — producto estrella concentra demasiado
    { fecha: '2026-03-03', producto: 'Isla y Pilota', categoria: 'Snacks', cantidad: 140, precio_unitario: 3200, precio_costo: 2100 },
    { fecha: '2026-03-03', producto: 'Alfajor Triple', categoria: 'Confitería', cantidad: 60, precio_unitario: 1800, precio_costo: 1100 },
    { fecha: '2026-03-03', producto: 'Agua Mineral 500ml', categoria: 'Bebidas', cantidad: 200, precio_unitario: 800, precio_costo: 480 },
    { fecha: '2026-03-04', producto: 'Isla y Pilota', categoria: 'Snacks', cantidad: 155, precio_unitario: 3200, precio_costo: 2100 },
    { fecha: '2026-03-04', producto: 'Galletitas Surtidas', categoria: 'Snacks', cantidad: 45, precio_unitario: 2100, precio_costo: 1400 },
    { fecha: '2026-03-04', producto: 'Gaseosa 2L', categoria: 'Bebidas', cantidad: 110, precio_unitario: 1600, precio_costo: 980 },
    { fecha: '2026-03-05', producto: 'Isla y Pilota', categoria: 'Snacks', cantidad: 148, precio_unitario: 3200, precio_costo: 2100 },
    { fecha: '2026-03-05', producto: 'Alfajor Triple', categoria: 'Confitería', cantidad: 72, precio_unitario: 1800, precio_costo: 1100 },
    { fecha: '2026-03-05', producto: 'Yerba 1kg', categoria: 'Infusiones', cantidad: 35, precio_unitario: 4200, precio_costo: 2900 },
    { fecha: '2026-03-06', producto: 'Isla y Pilota', categoria: 'Snacks', cantidad: 162, precio_unitario: 3200, precio_costo: 2100 },
    { fecha: '2026-03-06', producto: 'Agua Mineral 500ml', categoria: 'Bebidas', cantidad: 220, precio_unitario: 800, precio_costo: 480 },
    { fecha: '2026-03-06', producto: 'Galletitas Surtidas', categoria: 'Snacks', cantidad: 38, precio_unitario: 2100, precio_costo: 1400 },
    { fecha: '2026-03-07', producto: 'Isla y Pilota', categoria: 'Snacks', cantidad: 170, precio_unitario: 3200, precio_costo: 2100 },
    { fecha: '2026-03-07', producto: 'Gaseosa 2L', categoria: 'Bebidas', cantidad: 95, precio_unitario: 1600, precio_costo: 980 },
    { fecha: '2026-03-07', producto: 'Alfajor Triple', categoria: 'Confitería', cantidad: 55, precio_unitario: 1800, precio_costo: 1100 },
    { fecha: '2026-03-08', producto: 'Isla y Pilota', categoria: 'Snacks', cantidad: 158, precio_unitario: 3200, precio_costo: 2100 },
    { fecha: '2026-03-08', producto: 'Yerba 1kg', categoria: 'Infusiones', cantidad: 28, precio_unitario: 4200, precio_costo: 2900 },
    { fecha: '2026-03-08', producto: 'Agua Mineral 500ml', categoria: 'Bebidas', cantidad: 185, precio_unitario: 800, precio_costo: 480 },
    { fecha: '2026-03-09', producto: 'Isla y Pilota', categoria: 'Snacks', cantidad: 145, precio_unitario: 3200, precio_costo: 2100 },
    { fecha: '2026-03-09', producto: 'Galletitas Surtidas', categoria: 'Snacks', cantidad: 42, precio_unitario: 2100, precio_costo: 1400 },
    { fecha: '2026-03-09', producto: 'Gaseosa 2L', categoria: 'Bebidas', cantidad: 88, precio_unitario: 1600, precio_costo: 980 },
  ],

  stock: [
    { producto: 'Isla y Pilota', categoria: 'Snacks', stock_actual: 22, stock_minimo: 100, precio_costo: 2100, precio_venta: 3200 },
    { producto: 'Alfajor Triple', categoria: 'Confitería', stock_actual: 340, stock_minimo: 80, precio_costo: 1100, precio_venta: 1800 },
    { producto: 'Agua Mineral 500ml', categoria: 'Bebidas', stock_actual: 480, stock_minimo: 200, precio_costo: 480, precio_venta: 800 },
    { producto: 'Gaseosa 2L', categoria: 'Bebidas', stock_actual: 165, stock_minimo: 80, precio_costo: 980, precio_venta: 1600 },
    { producto: 'Galletitas Surtidas', categoria: 'Snacks', stock_actual: 290, stock_minimo: 60, precio_costo: 1400, precio_venta: 2100 },
    { producto: 'Yerba 1kg', categoria: 'Infusiones', stock_actual: 85, stock_minimo: 40, precio_costo: 2900, precio_venta: 4200 },
    // Stock muerto — herramientas sin rotación
    { producto: 'Cinta Adhesiva x50', categoria: 'Limpieza', stock_actual: 420, stock_minimo: 30, precio_costo: 380, precio_venta: 650 },
    { producto: 'Escoba Industrial', categoria: 'Limpieza', stock_actual: 180, stock_minimo: 20, precio_costo: 1200, precio_venta: 1900 },
    { producto: 'Detergente 5L', categoria: 'Limpieza', stock_actual: 210, stock_minimo: 40, precio_costo: 1800, precio_venta: 2800 },
  ],

  marketing: [
    { canal: 'Meta Ads', campana: 'Snacks Mayorista', gasto: 45000, clics: 1200, conversiones: 18, ingresos_generados: 62000 },
    { canal: 'Meta Ads', campana: 'Bebidas Verano', gasto: 32000, clics: 890, conversiones: 6, ingresos_generados: 28000 },
    { canal: 'WhatsApp', campana: 'Lista Mayoristas', gasto: 0, clics: 0, conversiones: 45, ingresos_generados: 380000 },
    { canal: 'Google Ads', campana: 'Distribuidora Salta', gasto: 28000, clics: 420, conversiones: 4, ingresos_generados: 31000 },
  ]
}

// ─────────────────────────────────────────────────────────────
// NEGOCIO 2: Ferretería con capital inmovilizado y márgenes bajos
// Perfil: stock muerto masivo, marketing ineficiente
// ─────────────────────────────────────────────────────────────
const ferreteriaElCentro: NegocioSimulado = {
  id: 'ferreteria-el-centro',
  nombre: 'Ferretería El Centro',
  rubro: 'Ferretería / Construcción',
  ciudad: 'Salta',
  tier: 'pro',
  avatar: 'FE',
  color: '#1A5276',

  ventas: [
    { fecha: '2026-03-03', producto: 'Cemento 50kg', categoria: 'Construcción', cantidad: 22, precio_unitario: 8500, precio_costo: 6200 },
    { fecha: '2026-03-03', producto: 'Pintura Látex 4L', categoria: 'Pinturas', cantidad: 8, precio_unitario: 12000, precio_costo: 7800 },
    { fecha: '2026-03-04', producto: 'Cemento 50kg', categoria: 'Construcción', cantidad: 18, precio_unitario: 8500, precio_costo: 6200 },
    { fecha: '2026-03-04', producto: 'Caño PVC 3m', categoria: 'Plomería', cantidad: 14, precio_unitario: 4800, precio_costo: 3200 },
    { fecha: '2026-03-04', producto: 'Tornillos x100', categoria: 'Fijaciones', cantidad: 35, precio_unitario: 1800, precio_costo: 900 },
    { fecha: '2026-03-05', producto: 'Pintura Látex 4L', categoria: 'Pinturas', cantidad: 12, precio_unitario: 12000, precio_costo: 7800 },
    { fecha: '2026-03-05', producto: 'Cemento 50kg', categoria: 'Construcción', cantidad: 25, precio_unitario: 8500, precio_costo: 6200 },
    { fecha: '2026-03-06', producto: 'Caño PVC 3m', categoria: 'Plomería', cantidad: 9, precio_unitario: 4800, precio_costo: 3200 },
    { fecha: '2026-03-06', producto: 'Cemento 50kg', categoria: 'Construcción', cantidad: 30, precio_unitario: 8500, precio_costo: 6200 },
    { fecha: '2026-03-07', producto: 'Tornillos x100', categoria: 'Fijaciones', cantidad: 28, precio_unitario: 1800, precio_costo: 900 },
    { fecha: '2026-03-07', producto: 'Pintura Látex 4L', categoria: 'Pinturas', cantidad: 6, precio_unitario: 12000, precio_costo: 7800 },
    { fecha: '2026-03-08', producto: 'Cemento 50kg', categoria: 'Construcción', cantidad: 20, precio_unitario: 8500, precio_costo: 6200 },
    { fecha: '2026-03-09', producto: 'Caño PVC 3m', categoria: 'Plomería', cantidad: 11, precio_unitario: 4800, precio_costo: 3200 },
    { fecha: '2026-03-09', producto: 'Cemento 50kg', categoria: 'Construcción', cantidad: 17, precio_unitario: 8500, precio_costo: 6200 },
  ],

  stock: [
    { producto: 'Cemento 50kg', categoria: 'Construcción', stock_actual: 280, stock_minimo: 50, precio_costo: 6200, precio_venta: 8500 },
    { producto: 'Pintura Látex 4L', categoria: 'Pinturas', stock_actual: 95, stock_minimo: 20, precio_costo: 7800, precio_venta: 12000 },
    { producto: 'Caño PVC 3m', categoria: 'Plomería', stock_actual: 140, stock_minimo: 30, precio_costo: 3200, precio_venta: 4800 },
    { producto: 'Tornillos x100', categoria: 'Fijaciones', stock_actual: 380, stock_minimo: 50, precio_costo: 900, precio_venta: 1800 },
    // Stock muerto — herramientas específicas sin movimiento
    { producto: 'Sierra Circular 7"', categoria: 'Herramientas', stock_actual: 12, stock_minimo: 3, precio_costo: 28000, precio_venta: 42000 },
    { producto: 'Taladro Percutor', categoria: 'Herramientas', stock_actual: 8, stock_minimo: 2, precio_costo: 35000, precio_venta: 52000 },
    { producto: 'Andamio Tubular', categoria: 'Herramientas', stock_actual: 6, stock_minimo: 2, precio_costo: 48000, precio_venta: 72000 },
    { producto: 'Nivel Láser', categoria: 'Herramientas', stock_actual: 15, stock_minimo: 3, precio_costo: 22000, precio_venta: 34000 },
    { producto: 'Cortadora de Azulejos', categoria: 'Herramientas', stock_actual: 9, stock_minimo: 2, precio_costo: 18000, precio_venta: 27000 },
  ],

  marketing: [
    { canal: 'Meta Ads', campana: 'Ferretería Centro Salta', gasto: 38000, clics: 640, conversiones: 5, ingresos_generados: 42000 },
    { canal: 'Meta Ads', campana: 'Herramientas Profesionales', gasto: 52000, clics: 980, conversiones: 3, ingresos_generados: 38000 },
    { canal: 'Google Ads', campana: 'Cemento Salta precio', gasto: 18000, clics: 310, conversiones: 12, ingresos_generados: 96000 },
  ]
}

// ─────────────────────────────────────────────────────────────
// NEGOCIO 3: Indumentaria con alto rendimiento y marketing eficiente
// Perfil: saludable, oportunidades de escala detectadas
// ─────────────────────────────────────────────────────────────
const ropaIndumentaria: NegocioSimulado = {
  id: 'ropa-indumentaria',
  nombre: 'Ropa & Estilo SA',
  rubro: 'Indumentaria / Moda',
  ciudad: 'Santiago del Estero',
  tier: 'copiloto',
  avatar: 'RI',
  color: '#1A4731',

  ventas: [
    { fecha: '2026-03-03', producto: 'Remera Básica', categoria: 'Remeras', cantidad: 45, precio_unitario: 8500, precio_costo: 3200 },
    { fecha: '2026-03-03', producto: 'Jean Slim', categoria: 'Pantalones', cantidad: 22, precio_unitario: 22000, precio_costo: 9500 },
    { fecha: '2026-03-03', producto: 'Campera Invierno', categoria: 'Abrigos', cantidad: 12, precio_unitario: 48000, precio_costo: 18000 },
    { fecha: '2026-03-04', producto: 'Remera Básica', categoria: 'Remeras', cantidad: 52, precio_unitario: 8500, precio_costo: 3200 },
    { fecha: '2026-03-04', producto: 'Jean Slim', categoria: 'Pantalones', cantidad: 18, precio_unitario: 22000, precio_costo: 9500 },
    { fecha: '2026-03-04', producto: 'Vestido Casual', categoria: 'Vestidos', cantidad: 15, precio_unitario: 18000, precio_costo: 6800 },
    { fecha: '2026-03-05', producto: 'Campera Invierno', categoria: 'Abrigos', cantidad: 18, precio_unitario: 48000, precio_costo: 18000 },
    { fecha: '2026-03-05', producto: 'Remera Básica', categoria: 'Remeras', cantidad: 60, precio_unitario: 8500, precio_costo: 3200 },
    { fecha: '2026-03-05', producto: 'Buzo Canguro', categoria: 'Buzos', cantidad: 28, precio_unitario: 28000, precio_costo: 11000 },
    { fecha: '2026-03-06', producto: 'Jean Slim', categoria: 'Pantalones', cantidad: 25, precio_unitario: 22000, precio_costo: 9500 },
    { fecha: '2026-03-06', producto: 'Campera Invierno', categoria: 'Abrigos', cantidad: 14, precio_unitario: 48000, precio_costo: 18000 },
    { fecha: '2026-03-06', producto: 'Vestido Casual', categoria: 'Vestidos', cantidad: 20, precio_unitario: 18000, precio_costo: 6800 },
    { fecha: '2026-03-07', producto: 'Remera Básica', categoria: 'Remeras', cantidad: 58, precio_unitario: 8500, precio_costo: 3200 },
    { fecha: '2026-03-07', producto: 'Buzo Canguro', categoria: 'Buzos', cantidad: 32, precio_unitario: 28000, precio_costo: 11000 },
    { fecha: '2026-03-07', producto: 'Jean Slim', categoria: 'Pantalones', cantidad: 20, precio_unitario: 22000, precio_costo: 9500 },
    { fecha: '2026-03-08', producto: 'Campera Invierno', categoria: 'Abrigos', cantidad: 22, precio_unitario: 48000, precio_costo: 18000 },
    { fecha: '2026-03-08', producto: 'Remera Básica', categoria: 'Remeras', cantidad: 48, precio_unitario: 8500, precio_costo: 3200 },
    { fecha: '2026-03-08', producto: 'Vestido Casual', categoria: 'Vestidos', cantidad: 18, precio_unitario: 18000, precio_costo: 6800 },
    { fecha: '2026-03-09', producto: 'Jean Slim', categoria: 'Pantalones', cantidad: 24, precio_unitario: 22000, precio_costo: 9500 },
    { fecha: '2026-03-09', producto: 'Campera Invierno', categoria: 'Abrigos', cantidad: 16, precio_unitario: 48000, precio_costo: 18000 },
    { fecha: '2026-03-09', producto: 'Buzo Canguro', categoria: 'Buzos', cantidad: 25, precio_unitario: 28000, precio_costo: 11000 },
  ],

  stock: [
    { producto: 'Remera Básica', categoria: 'Remeras', stock_actual: 420, stock_minimo: 100, precio_costo: 3200, precio_venta: 8500 },
    { producto: 'Jean Slim', categoria: 'Pantalones', stock_actual: 185, stock_minimo: 50, precio_costo: 9500, precio_venta: 22000 },
    { producto: 'Campera Invierno', categoria: 'Abrigos', stock_actual: 88, stock_minimo: 30, precio_costo: 18000, precio_venta: 48000 },
    { producto: 'Buzo Canguro', categoria: 'Buzos', stock_actual: 220, stock_minimo: 60, precio_costo: 11000, precio_venta: 28000 },
    { producto: 'Vestido Casual', categoria: 'Vestidos', stock_actual: 145, stock_minimo: 40, precio_costo: 6800, precio_venta: 18000 },
    { producto: 'Bermuda Verano', categoria: 'Pantalones', stock_actual: 95, stock_minimo: 30, precio_costo: 5200, precio_venta: 12000 },
  ],

  marketing: [
    { canal: 'Meta Ads', campana: 'Camperas Invierno 2026', gasto: 65000, clics: 2800, conversiones: 48, ingresos_generados: 980000 },
    { canal: 'Meta Ads', campana: 'Básicos Temporada', gasto: 42000, clics: 1900, conversiones: 62, ingresos_generados: 480000 },
    { canal: 'Instagram Orgánico', campana: 'Contenido Moda', gasto: 0, clics: 0, conversiones: 35, ingresos_generados: 320000 },
    { canal: 'Google Ads', campana: 'Indumentaria Santiago', gasto: 28000, clics: 820, conversiones: 22, ingresos_generados: 195000 },
  ]
}

// ─────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────
export const NEGOCIOS_SIMULADOS: NegocioSimulado[] = [
  distribuidoraNorte,
  ferreteriaElCentro,
  ropaIndumentaria,
]

export function getNegocio(id: string): NegocioSimulado | undefined {
  return NEGOCIOS_SIMULADOS.find(n => n.id === id)
}
