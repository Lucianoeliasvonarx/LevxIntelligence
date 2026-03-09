// ─────────────────────────────────────────────────────────────
// MOTOR DE MÉTRICAS — InsightPilot
// Calcula todas las métricas de negocio y marketing
// ─────────────────────────────────────────────────────────────
import type { Venta, StockItem, CampanaMarketing } from './simulated-businesses'

export interface MetricasNegocio {
  // Ventas
  ingresos_totales: number
  costo_total: number
  margen_bruto: number
  margen_porcentaje: number
  ticket_promedio: number
  total_transacciones: number
  unidades_vendidas: number
  ventas_por_producto: Record<string, { ingresos: number; unidades: number; margen: number }>
  ventas_por_categoria: Record<string, { ingresos: number; porcentaje: number }>
  producto_top: string
  dependencia_producto_top: number

  // Inventario
  capital_total_stock: number
  capital_inmovilizado: number
  productos_quiebre_critico: StockItem[]
  productos_bajo_minimo: StockItem[]
  productos_exceso: StockItem[]
  dias_inventario_por_producto: Record<string, number>

  // Marketing
  roas_por_campana: Array<{ canal: string; campana: string; roas: number; cac: number; ingresos: number; gasto: number }>
  roas_promedio: number
  gasto_total_marketing: number
  ingresos_total_marketing: number
  cac_promedio: number
  canal_mas_rentable: string
  campanas_ineficientes: string[]

  // Health Score
  health_score: number
  health_label: string
  salud_por_area: {
    stock: number
    ventas: number
    margen: number
    rotacion: number
    marketing: number
  }
}

export function calcularMetricas(
  ventas: Venta[],
  stock: StockItem[],
  marketing: CampanaMarketing[]
): MetricasNegocio {

  // ── VENTAS ──────────────────────────────────────────────────
  const ingresos_totales = ventas.reduce((s, v) => s + v.cantidad * v.precio_unitario, 0)
  const costo_total      = ventas.reduce((s, v) => s + v.cantidad * v.precio_costo, 0)
  const margen_bruto     = ingresos_totales - costo_total
  const margen_porcentaje = ingresos_totales > 0 ? (margen_bruto / ingresos_totales) * 100 : 0
  const unidades_vendidas = ventas.reduce((s, v) => s + v.cantidad, 0)

  // Agrupar por fecha para calcular transacciones (una por día por producto)
  const dias_unicos = new Set(ventas.map(v => v.fecha)).size
  const total_transacciones = ventas.length
  const ticket_promedio = total_transacciones > 0 ? ingresos_totales / total_transacciones : 0

  // Ventas por producto
  const ventas_por_producto: MetricasNegocio['ventas_por_producto'] = {}
  for (const v of ventas) {
    if (!ventas_por_producto[v.producto]) {
      ventas_por_producto[v.producto] = { ingresos: 0, unidades: 0, margen: 0 }
    }
    const ing = v.cantidad * v.precio_unitario
    const cos = v.cantidad * v.precio_costo
    ventas_por_producto[v.producto].ingresos += ing
    ventas_por_producto[v.producto].unidades += v.cantidad
    ventas_por_producto[v.producto].margen   += ing - cos
  }
  // Porcentaje de margen por producto
  for (const p of Object.keys(ventas_por_producto)) {
    const d = ventas_por_producto[p]
    d.margen = d.ingresos > 0 ? (d.margen / d.ingresos) * 100 : 0
  }

  // Ventas por categoría
  const cat_raw: Record<string, number> = {}
  for (const v of ventas) {
    cat_raw[v.categoria] = (cat_raw[v.categoria] || 0) + v.cantidad * v.precio_unitario
  }
  const ventas_por_categoria: MetricasNegocio['ventas_por_categoria'] = {}
  for (const cat of Object.keys(cat_raw)) {
    ventas_por_categoria[cat] = {
      ingresos: cat_raw[cat],
      porcentaje: ingresos_totales > 0 ? (cat_raw[cat] / ingresos_totales) * 100 : 0
    }
  }

  // Producto top y dependencia
  const producto_top = Object.entries(ventas_por_producto)
    .sort((a, b) => b[1].ingresos - a[1].ingresos)[0]?.[0] || ''
  const dependencia_producto_top = ingresos_totales > 0
    ? (ventas_por_producto[producto_top]?.ingresos / ingresos_totales) * 100
    : 0

  // ── INVENTARIO ───────────────────────────────────────────────
  const capital_total_stock = stock.reduce((s, i) => s + i.stock_actual * i.precio_costo, 0)

  // Ventas diarias por producto
  const ventas_diarias: Record<string, number> = {}
  for (const v of ventas) {
    ventas_diarias[v.producto] = (ventas_diarias[v.producto] || 0) + v.cantidad
  }
  const dias_periodo = dias_unicos > 0 ? dias_unicos : 7

  const dias_inventario_por_producto: Record<string, number> = {}
  for (const item of stock) {
    const vd = (ventas_diarias[item.producto] || 0) / dias_periodo
    dias_inventario_por_producto[item.producto] = vd > 0
      ? Math.round(item.stock_actual / vd)
      : 999 // sin ventas = capital muerto
  }

  const productos_quiebre_critico = stock.filter(i =>
    dias_inventario_por_producto[i.producto] <= 5 && i.stock_actual > 0
  )
  const productos_bajo_minimo = stock.filter(i =>
    i.stock_actual < i.stock_minimo && dias_inventario_por_producto[i.producto] > 5
  )
  const productos_exceso = stock.filter(i =>
    dias_inventario_por_producto[i.producto] > 60
  )
  const capital_inmovilizado = productos_exceso.reduce(
    (s, i) => s + i.stock_actual * i.precio_costo, 0
  )

  // ── MARKETING ────────────────────────────────────────────────
  const gasto_total_marketing = marketing.reduce((s, c) => s + c.gasto, 0)
  const ingresos_total_marketing = marketing.reduce((s, c) => s + c.ingresos_generados, 0)
  const total_conversiones = marketing.reduce((s, c) => s + c.conversiones, 0)

  const roas_por_campana = marketing.map(c => ({
    canal: c.canal,
    campana: c.campana,
    roas: c.gasto > 0 ? parseFloat((c.ingresos_generados / c.gasto).toFixed(2)) : 0,
    cac: c.conversiones > 0 ? Math.round(c.gasto / c.conversiones) : 0,
    ingresos: c.ingresos_generados,
    gasto: c.gasto
  }))

  const campanas_pagas = roas_por_campana.filter(c => c.gasto > 0)
  const roas_promedio = campanas_pagas.length > 0
    ? parseFloat((campanas_pagas.reduce((s, c) => s + c.roas, 0) / campanas_pagas.length).toFixed(2))
    : 0
  const cac_promedio = total_conversiones > 0
    ? Math.round(gasto_total_marketing / total_conversiones)
    : 0

  const campanas_ineficientes = roas_por_campana
    .filter(c => c.gasto > 0 && c.roas < 2)
    .map(c => c.campana)

  const canal_mas_rentable = roas_por_campana
    .filter(c => c.gasto > 0)
    .sort((a, b) => b.roas - a.roas)[0]?.canal || 'Sin datos'

  // ── HEALTH SCORE ─────────────────────────────────────────────
  // Stock (0-100)
  const ratio_quiebre = stock.length > 0
    ? (productos_quiebre_critico.length + productos_bajo_minimo.length * 0.5) / stock.length
    : 0
  const score_stock = Math.max(0, Math.round(100 - ratio_quiebre * 100))

  // Ventas (0-100): basado en diversificación y crecimiento
  const score_ventas = Math.max(0, Math.min(100,
    Math.round(100 - dependencia_producto_top * 0.6 + Math.min(20, dias_unicos))
  ))

  // Margen (0-100)
  const score_margen = Math.max(0, Math.min(100, Math.round(
    margen_porcentaje < 10 ? 20 :
    margen_porcentaje < 20 ? 45 :
    margen_porcentaje < 30 ? 65 :
    margen_porcentaje < 40 ? 80 : 92
  )))

  // Rotación (0-100)
  const pct_exceso = stock.length > 0 ? productos_exceso.length / stock.length : 0
  const score_rotacion = Math.max(0, Math.round(100 - pct_exceso * 80))

  // Marketing (0-100)
  const score_marketing = gasto_total_marketing === 0 ? 50 :
    roas_promedio >= 4 ? 90 :
    roas_promedio >= 3 ? 75 :
    roas_promedio >= 2 ? 60 :
    roas_promedio >= 1.5 ? 40 : 20

  const salud_por_area = {
    stock:     score_stock,
    ventas:    score_ventas,
    margen:    score_margen,
    rotacion:  score_rotacion,
    marketing: score_marketing,
  }

  const health_score = Math.round(
    score_stock     * 0.20 +
    score_ventas    * 0.20 +
    score_margen    * 0.20 +
    score_rotacion  * 0.20 +
    score_marketing * 0.20
  )

  const health_label =
    health_score >= 80 ? 'Excelente' :
    health_score >= 65 ? 'Saludable' :
    health_score >= 45 ? 'En riesgo' : 'Crítico'

  return {
    ingresos_totales, costo_total, margen_bruto, margen_porcentaje,
    ticket_promedio, total_transacciones, unidades_vendidas,
    ventas_por_producto, ventas_por_categoria,
    producto_top, dependencia_producto_top,
    capital_total_stock, capital_inmovilizado,
    productos_quiebre_critico, productos_bajo_minimo, productos_exceso,
    dias_inventario_por_producto,
    roas_por_campana, roas_promedio, gasto_total_marketing,
    ingresos_total_marketing, cac_promedio, canal_mas_rentable,
    campanas_ineficientes,
    health_score, health_label, salud_por_area,
  }
}

export function formatPesos(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toLocaleString('es-AR')}`
}
