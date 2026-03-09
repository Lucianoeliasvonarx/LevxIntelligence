// ─────────────────────────────────────────────────────────────
// PROMPTS — InsightPilot · Levx Intelligence
// Ventaja competitiva: prompt especializado en negocios argentinos
// ─────────────────────────────────────────────────────────────
import type { MetricasNegocio } from './metrics'

export function buildDiagnosticPrompt(
  nombreNegocio: string,
  rubro: string,
  ciudad: string,
  metricas: MetricasNegocio
): string {
  const {
    ingresos_totales, margen_porcentaje, ticket_promedio,
    dependencia_producto_top, producto_top,
    capital_inmovilizado, capital_total_stock,
    productos_quiebre_critico, productos_bajo_minimo, productos_exceso,
    roas_promedio, cac_promedio, campanas_ineficientes, canal_mas_rentable,
    health_score, salud_por_area,
    ventas_por_producto,
  } = metricas

  // Top 3 productos por ingresos
  const top_productos = Object.entries(ventas_por_producto)
    .sort((a, b) => b[1].ingresos - a[1].ingresos)
    .slice(0, 5)
    .map(([nombre, d]) => `${nombre}: $${d.ingresos.toLocaleString()} (margen ${d.margen.toFixed(0)}%)`)
    .join('\n')

  const quiebres = productos_quiebre_critico.map(p =>
    `${p.producto}: ${p.stock_actual} unidades restantes`
  ).join(', ') || 'ninguno'

  const exceso = productos_exceso.map(p =>
    `${p.producto}: ${p.stock_actual} unidades`
  ).join(', ') || 'ninguno'

  return `
Sos un analista de inteligencia de negocios senior especializado en PyMEs y empresas medianas de Argentina, específicamente del NOA (Noroeste Argentino). Hablás en español rioplatense, directo, sin rodeos y con foco total en decisiones concretas.

Analizá el siguiente reporte del negocio "${nombreNegocio}" (${rubro}, ${ciudad}) y devolvé un diagnóstico completo.

═══════════════════════════════
DATOS DEL PERÍODO (última semana)
═══════════════════════════════

INGRESOS Y RENTABILIDAD
- Ingresos totales: $${ingresos_totales.toLocaleString('es-AR')}
- Margen bruto: ${margen_porcentaje.toFixed(1)}%
- Ticket promedio: $${ticket_promedio.toLocaleString('es-AR')}

TOP 5 PRODUCTOS POR INGRESOS
${top_productos}

CONCENTRACIÓN
- Producto principal: "${producto_top}"
- Dependencia: ${dependencia_producto_top.toFixed(1)}% de los ingresos totales

INVENTARIO
- Capital total en stock: $${capital_total_stock.toLocaleString('es-AR')}
- Capital inmovilizado (rotación >60 días): $${capital_inmovilizado.toLocaleString('es-AR')}
- Productos en quiebre crítico (<5 días): ${quiebres}
- Productos con exceso de stock: ${exceso}

MARKETING
- ROAS promedio: ${roas_promedio.toFixed(2)}x
- CAC promedio: $${cac_promedio.toLocaleString('es-AR')}
- Canal más rentable: ${canal_mas_rentable}
- Campañas ineficientes (ROAS < 2): ${campanas_ineficientes.join(', ') || 'ninguna'}

HEALTH SCORE CALCULADO: ${health_score}/100
- Stock: ${salud_por_area.stock}/100
- Ventas: ${salud_por_area.ventas}/100
- Margen: ${salud_por_area.margen}/100
- Rotación: ${salud_por_area.rotacion}/100
- Marketing: ${salud_por_area.marketing}/100

═══════════════════════════════
INSTRUCCIÓN
═══════════════════════════════

Devolvé ÚNICAMENTE un JSON válido con esta estructura exacta. Sin texto antes ni después. Sin bloques de código Markdown.

{
  "score": número entre 0 y 100,
  "score_label": "Crítico" | "En riesgo" | "Saludable" | "Excelente",
  "resumen": "Un párrafo ejecutivo de 3-4 oraciones en español rioplatense. Directo. Sin tecnicismos. Mencioná los 2 problemas más urgentes y la oportunidad más grande.",
  "kpis": [
    { "label": "nombre del KPI", "valor": "valor formateado", "sub": "contexto breve", "tendencia": "up" | "down" | "flat" }
  ],
  "alertas": [
    {
      "nivel": "danger" | "warn" | "ok",
      "categoria": "stock" | "ventas" | "marketing" | "inventario" | "concentración" | "oportunidad",
      "titulo": "título corto y directo",
      "detalle": "explicación de 1-2 oraciones con números concretos",
      "accion_inmediata": "qué hacer esta semana"
    }
  ],
  "recomendaciones": [
    {
      "prioridad": número 1 al 4,
      "titulo": "acción concreta",
      "plazo": "Esta semana" | "Próximas 2 semanas" | "Este mes",
      "impacto": "alto" | "medio" | "bajo",
      "detalle": "cómo hacerlo, con números cuando sea posible"
    }
  ],
  "productos_criticos": [
    { "nombre": "nombre del producto", "estado": "quiebre" | "sobrestock" | "estrella" | "dormido" | "dependencia", "dato": "dato clave" }
  ],
  "marketing": {
    "roas_promedio": número,
    "cac": número,
    "campanas_ineficientes": ["lista de campañas"],
    "canal_mas_rentable": "nombre del canal",
    "recomendacion": "qué cambiar en marketing esta semana"
  },
  "salud_por_area": {
    "stock": número 0-100,
    "ventas": número 0-100,
    "margen": número 0-100,
    "rotacion": número 0-100,
    "marketing": número 0-100
  }
}

Reglas estrictas:
- Usá números reales del análisis, no inventés datos
- El tono es de consultor argentino: directo, sin eufemismos
- Mínimo 3 alertas, máximo 6. Mínimo 3 kpis, máximo 5
- Las recomendaciones deben ser accionables esta semana o este mes, no genéricas
- Si hay ROAS < 2 en alguna campaña, mencionalo explícitamente
- Si hay quiebre inminente, es siempre alerta nivel "danger"
`.trim()
}
