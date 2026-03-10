'use client'
import { useState, useRef } from "react"

const T = {
  ink: '#060E1A', ink1: '#091425', ink2: '#0C1A30',
  indigo: '#2D42CC', sky: '#4C8EF0',
  skyDim: 'rgba(76,142,240,.12)', skyB: 'rgba(76,142,240,.22)',
  text: '#E8EEF8', dim: '#7A90B4', xs: '#4A607E',
  bs: 'rgba(255,255,255,.055)',
  ok: '#0DB87A', warn: '#E88C0C', danger: '#D94040',
}

const PREGUNTAS = [
  { id: 'datos', pregunta: '¿Tenés datos de tu negocio disponibles?', sub: 'Ventas, stock, facturación — en cualquier formato', opciones: [
    { id: 'si_archivo', label: 'Sí, tengo archivos', sub: 'Excel, CSV o similar', icon: '📁', tier: 'pro' },
    { id: 'si_sistema', label: 'Sí, uso un sistema', sub: 'POS, Shopify, WooCommerce, MercadoPago', icon: '🔗', tier: 'copiloto' },
    { id: 'no', label: 'No tengo datos ordenados', sub: 'Manejo todo de memoria o en papel', icon: '📝', tier: 'inicial' },
  ]},
  { id: 'problema', pregunta: '¿Cuál es tu problema más urgente hoy?', sub: 'Elegí el que más te preocupa', opciones: [
    { id: 'ventas', label: 'Mis ventas bajaron', sub: 'No sé por qué ni qué hacer', icon: '📉', tier: 'pro' },
    { id: 'stock', label: 'Tengo plata atrapada en stock', sub: 'Mercadería que no rota', icon: '📦', tier: 'pro' },
    { id: 'marketing', label: 'Gasto en publicidad y no veo resultados', sub: 'Meta Ads, Google Ads, etc.', icon: '📢', tier: 'copiloto' },
    { id: 'general', label: 'No sé cómo va realmente mi negocio', sub: 'Necesito una visión completa', icon: '🧭', tier: 'inicial' },
  ]},
  { id: 'facturacion', pregunta: '¿Cuánto factura tu negocio por mes?', sub: 'Aproximado en pesos argentinos', opciones: [
    { id: 'menos1m', label: 'Menos de $1M', sub: 'ARS por mes', icon: '💰', tier: 'inicial' },
    { id: '1a5m', label: '$1M a $5M', sub: 'ARS por mes', icon: '💰', tier: 'pro' },
    { id: '5a20m', label: '$5M a $20M', sub: 'ARS por mes', icon: '💰', tier: 'copiloto' },
    { id: 'mas20m', label: 'Más de $20M', sub: 'ARS por mes', icon: '💰', tier: 'copiloto' },
  ]},
  { id: 'urgencia', pregunta: '¿Con qué urgencia necesitás tomar decisiones?', sub: 'Esto define el tipo de servicio que necesitás', opciones: [
    { id: 'esta_semana', label: 'Esta semana', sub: 'Hay algo urgente que resolver', icon: '🔥', tier: 'pro' },
    { id: 'este_mes', label: 'Este mes', sub: 'Quiero entender qué está pasando', icon: '📅', tier: 'pro' },
    { id: 'a_largo', label: 'Quiero mejorar a largo plazo', sub: 'Monitoreo continuo y estrategia', icon: '🚀', tier: 'copiloto' },
  ]},
]

const LABELS = {
  si_archivo: 'Tiene archivos (Excel/CSV)', si_sistema: 'Usa un sistema (POS/Shopify)', no: 'Sin datos ordenados',
  ventas: 'Ventas bajaron', stock: 'Capital atrapado en stock', marketing: 'Publicidad sin resultados', general: 'Sin visión general',
  menos1m: 'Menos de $1M/mes', '1a5m': '$1M a $5M/mes', '5a20m': '$5M a $20M/mes', mas20m: 'Más de $20M/mes',
  esta_semana: 'Urgencia inmediata', este_mes: 'Este mes', a_largo: 'Largo plazo',
}

const RESULTADOS = {
  inicial: {
    tier: 'Diagnóstico Inicial', precio: '$300 USD', color: T.sky,
    descripcion: 'Empezamos desde cero. Te damos una plantilla, la completás con 1 semana de datos, y te devolvemos un diagnóstico con los principales problemas y oportunidades de tu negocio.',
    incluye: ['Plantilla de datos InsightPilot', 'Diagnóstico básico del negocio', 'Health Score inicial', 'Reporte con 3 acciones prioritarias', 'Reunión de 30 minutos'],
    cta: 'Quiero el Diagnóstico Inicial',
    insight: 'El primer paso es ordenar la información. Sin datos claros, cada decisión es una apuesta.',
  },
  pro: {
    tier: 'Diagnóstico Pro', precio: '$800 USD', color: T.indigo,
    descripcion: 'Subís tus archivos de ventas y stock. InsightPilot los analiza con IA y te entrega un reporte completo con alertas, proyecciones y plan de acción concreto.',
    incluye: ['Análisis completo de ventas e inventario', 'Business Health Score detallado', 'Proyección de ingresos 30/60/90 días', 'Análisis de marketing y ROAS', 'Reporte PDF ejecutivo', 'Reunión estratégica de 60 minutos'],
    cta: 'Quiero el Diagnóstico Pro',
    insight: 'Tenés los datos pero no el análisis. Hay decisiones pendientes que el diagnóstico va a resolver.',
  },
  copiloto: {
    tier: 'Copiloto Mensual', precio: '$1.500 USD/mes', color: T.ok,
    descripcion: 'Dashboard en tiempo real, alertas automáticas, reporte semanal y simulador de decisiones. Todo conectado con tus sistemas. Reunión estratégica mensual incluida.',
    incluye: ['Dashboard en tiempo real', 'Alertas automáticas por WhatsApp', 'Reporte ejecutivo semanal', 'Simulador de decisiones con IA', 'Análisis de campañas publicitarias', 'Reunión estratégica mensual', 'Soporte prioritario'],
    cta: 'Quiero el Copiloto Mensual',
    insight: 'Tu negocio tiene escala para justificar monitoreo continuo. El costo de no tenerlo es mayor que el servicio.',
  },
}

function calcularTier(r: any) {
  const p = { inicial: 0, pro: 0, copiloto: 0 }
  PREGUNTAS.forEach(preg => { const op = preg.opciones.find(o => o.id === r[preg.id]); if (op?.tier) p[op.tier]++ })
  if (p.copiloto >= 2) return 'copiloto'
  if (p.pro >= 2) return 'pro'
  return 'inicial'
}

const Logo = () => (
  <svg width="26" height="29" viewBox="0 0 46 50" fill="none">
    <rect x="0" y="10" width="6" height="40" fill="#4C8EF0"/>
    <rect x="0" y="44" width="22" height="6" fill="#4C8EF0"/>
    <polygon points="8,0 36,0 46,10 8,10" fill="#4C8EF0"/>
    <rect x="14" y="14" width="5" height="20" fill="white" opacity=".9"/>
    <rect x="22" y="18" width="5" height="16" fill="white" opacity=".7"/>
    <rect x="30" y="22" width="5" height="12" fill="white" opacity=".5"/>
  </svg>
)

// ── PDF component rendered off-screen then printed ──
function PDFContent({ nombre, empresa, telefono, respuestas, resultado }) {
  const fecha = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
  return (
    <div id="pdf-content" style={{ display: 'none', fontFamily: 'Arial, sans-serif', padding: 40, maxWidth: 700, background: 'white', color: '#0a0a0a' }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #pdf-content, #pdf-content * { visibility: visible; display: block !important; }
          #pdf-content { position: fixed; top: 0; left: 0; width: 100%; padding: 32px; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, paddingBottom: 20, borderBottom: '3px solid #2D42CC' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="36" height="40" viewBox="0 0 46 50" fill="none">
            <rect x="0" y="10" width="6" height="40" fill="#4C8EF0"/>
            <rect x="0" y="44" width="22" height="6" fill="#4C8EF0"/>
            <polygon points="8,0 36,0 46,10 8,10" fill="#4C8EF0"/>
            <rect x="14" y="14" width="5" height="20" fill="#2D42CC" opacity=".9"/>
            <rect x="22" y="18" width="5" height="16" fill="#2D42CC" opacity=".7"/>
            <rect x="30" y="22" width="5" height="12" fill="#2D42CC" opacity=".5"/>
          </svg>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#060E1A' }}>InsightPilot</div>
            <div style={{ fontSize: 12, color: '#7A90B4' }}>by Levx Intelligence</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a' }}>Diagnóstico de Negocio</div>
          <div style={{ fontSize: 12, color: '#666' }}>{fecha}</div>
        </div>
      </div>

      {/* Datos del lead */}
      <div style={{ background: '#f7f8fc', borderRadius: 10, padding: '16px 20px', marginBottom: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10 }}>Datos del diagnóstico</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { l: 'Nombre', v: nombre },
            { l: 'Empresa', v: empresa },
            { l: 'Teléfono', v: telefono },
          ].map((d, i) => (
            <div key={i}>
              <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{d.l}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0a0a0a' }}>{d.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Resultado */}
      <div style={{ background: '#eef2ff', borderRadius: 10, padding: '20px 24px', marginBottom: 24, borderLeft: '5px solid #2D42CC' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#2D42CC', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 6 }}>Recomendación personalizada</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#060E1A', marginBottom: 4 }}>{resultado.tier}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#2D42CC', marginBottom: 12 }}>{resultado.precio}</div>
        <div style={{ fontSize: 13, color: '#333', lineHeight: 1.65, marginBottom: 12 }}>{resultado.descripcion}</div>
        <div style={{ fontSize: 13, fontStyle: 'italic', color: '#555', background: '#fff', borderRadius: 6, padding: '10px 14px', borderLeft: '3px solid #4C8EF0' }}>
          "{resultado.insight}"
        </div>
      </div>

      {/* Qué incluye */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 12 }}>Qué incluye este servicio</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {resultado.incluye.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#333' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#e6f7f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0DB87A" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Resumen respuestas */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 12 }}>Resumen del diagnóstico</div>
        {PREGUNTAS.map((p) => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', fontSize: 13 }}>
            <span style={{ color: '#666' }}>{p.pregunta.replace('¿','').replace('?','')}</span>
            <span style={{ fontWeight: 700, color: '#0a0a0a' }}>{LABELS[respuestas[p.id]] || ''}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: '#666' }}>
          <strong style={{ color: '#0a0a0a' }}>Levx Intelligence</strong> · hola@levx.com.ar · +54 9 385 314 2987
        </div>
        <div style={{ fontSize: 12, color: '#2D42CC', fontWeight: 700 }}>insightpilot.levx.com.ar</div>
      </div>
    </div>
  )
}

export default function Quiz() {
  const [paso, setPaso] = useState(0)
  const [respuestas, setRespuestas] = useState({})
  const [sel, setSel] = useState(null)
  const [nombre, setNombre] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [telefono, setTelefono] = useState('')
  const [pdfReady, setPdfReady] = useState(false)

  const pregunta = PREGUNTAS[paso - 1]
  const total = PREGUNTAS.length
  const progreso = paso === 0 ? 0 : paso > total ? 100 : (paso / total) * 100
  const tier = paso === 6 ? calcularTier(respuestas) : 'pro'
  const resultado = paso === 6 ? RESULTADOS[tier] : null
  const completo = nombre.trim() && empresa.trim() && telefono.trim()

  const elegir = (id) => {
    if (sel) return
    setSel(id)
    setTimeout(() => {
      setRespuestas(p => ({ ...p, [pregunta.id]: id }))
      setSel(null)
      setPaso(p => p < total ? p + 1 : 5)
    }, 350)
  }

  const descargarPDF = () => {
    const el = document.getElementById('pdf-content')
    if (el) {
      el.style.display = 'block'
      window.print()
      setTimeout(() => { el.style.display = 'none' }, 500)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: T.ink, color: T.text, fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>

      {resultado && <PDFContent nombre={nombre} empresa={empresa} telefono={telefono} respuestas={respuestas} resultado={resultado}/>}

      {/* NAV */}
      <nav style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${T.bs}`, background: T.ink1, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo/>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>InsightPilot</div>
            <div style={{ fontSize: 10, color: T.dim }}>by Levx Intelligence</div>
          </div>
        </div>
        {paso > 0 && paso < 5 && (
          <div style={{ fontSize: 12, color: T.dim }}>
            Pregunta <span style={{ color: T.sky, fontWeight: 700 }}>{paso}</span> de {total}
          </div>
        )}
      </nav>

      {/* PROGRESS */}
      {paso > 0 && paso < 6 && (
        <div style={{ height: 3, background: 'rgba(255,255,255,.05)' }}>
          <div style={{ height: '100%', width: `${progreso}%`, background: `linear-gradient(90deg, ${T.indigo}, ${T.sky})`, transition: 'width .5s ease' }}/>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>

        {/* INTRO */}
        {paso === 0 && (
          <div style={{ maxWidth: 520, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.skyDim, border: `1px solid ${T.skyB}`, borderRadius: 99, padding: '5px 14px', marginBottom: 20 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: T.ok }}/>
              <span style={{ fontSize: 10, fontWeight: 700, color: T.sky, letterSpacing: '.09em', textTransform: 'uppercase' }}>Diagnóstico gratuito · 2 minutos</span>
            </div>
            <h1 style={{ fontSize: 34, fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 14 }}>
              ¿Qué servicio<br/><span style={{ color: T.sky }}>necesita tu negocio?</span>
            </h1>
            <p style={{ fontSize: 15, color: T.dim, lineHeight: 1.7, marginBottom: 28 }}>
              Respondé 4 preguntas y recibís un diagnóstico personalizado con el plan exacto para tu negocio.
            </p>
            <button onClick={() => setPaso(1)} style={{ background: T.indigo, color: '#fff', border: 'none', borderRadius: 10, padding: '13px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 28px rgba(45,66,204,.4)' }}>
              Empezar diagnóstico →
            </button>
            <div style={{ marginTop: 12, fontSize: 11, color: T.xs }}>Sin registro · Sin tarjeta · Recibís el reporte en PDF</div>
          </div>
        )}

        {/* PREGUNTAS */}
        {paso >= 1 && paso <= total && pregunta && (
          <div style={{ maxWidth: 580, width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{pregunta.pregunta}</h2>
              <p style={{ fontSize: 13, color: T.dim }}>{pregunta.sub}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pregunta.opciones.map(op => (
                <div key={op.id} onClick={() => elegir(op.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 11, cursor: 'pointer', background: sel === op.id ? T.skyDim : T.ink1, border: `1px solid ${sel === op.id ? T.sky : T.bs}`, transform: sel === op.id ? 'translateX(5px)' : 'none', transition: 'all .15s' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 9, flexShrink: 0, background: T.ink2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{op.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{op.label}</div>
                    <div style={{ fontSize: 12, color: T.dim }}>{op.sub}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={sel === op.id ? T.sky : T.xs} strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              ))}
            </div>
            {paso > 1 && (
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button onClick={() => setPaso(p => p - 1)} style={{ background: 'transparent', border: 'none', color: T.dim, fontSize: 12, cursor: 'pointer' }}>← Volver</button>
              </div>
            )}
          </div>
        )}

        {/* DATOS CONTACTO */}
        {paso === 5 && (
          <div style={{ maxWidth: 440, width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${T.ok}18`, border: `1px solid ${T.ok}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.ok} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Tu diagnóstico está listo</h2>
              <p style={{ fontSize: 13, color: T.dim, lineHeight: 1.65 }}>
                Ingresá tus datos para descargar el reporte PDF personalizado.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Tu nombre', ph: 'María García', val: nombre, set: setNombre },
                { label: 'Tu empresa', ph: 'Distribuidora García SRL', val: empresa, set: setEmpresa },
                { label: 'WhatsApp', ph: '+54 9 385 000 0000', val: telefono, set: setTelefono },
              ].map((c, i) => (
                <div key={i}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: T.dim, textTransform: 'uppercase', letterSpacing: '.09em', display: 'block', marginBottom: 5 }}>{c.label}</label>
                  <input type="text" value={c.val} placeholder={c.ph} onChange={e => c.set(e.target.value)}
                    style={{ width: '100%', padding: '11px 13px', background: T.ink2, border: `1px solid ${T.bs}`, borderRadius: 8, color: T.text, fontSize: 14, fontFamily: 'inherit', outline: 'none' }}/>
                </div>
              ))}
            </div>
            <button onClick={() => { if (completo) setPaso(6) }} disabled={!completo}
              style={{ width: '100%', background: completo ? T.indigo : 'rgba(45,66,204,.25)', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 700, cursor: completo ? 'pointer' : 'not-allowed', boxShadow: completo ? '0 8px 28px rgba(45,66,204,.4)' : 'none', transition: 'all .2s' }}>
              Ver mi diagnóstico →
            </button>
          </div>
        )}

        {/* RESULTADO */}
        {paso === 6 && resultado && (
          <div style={{ maxWidth: 580, width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: `${resultado.color}18`, border: `1px solid ${resultado.color}40`, borderRadius: 99, padding: '5px 13px', marginBottom: 12 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: resultado.color }}/>
                <span style={{ fontSize: 10, fontWeight: 700, color: resultado.color, letterSpacing: '.08em', textTransform: 'uppercase' }}>Diagnóstico para {nombre}</span>
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 6 }}>{resultado.tier}</h2>
              <div style={{ fontSize: 30, fontWeight: 900, color: resultado.color, marginBottom: 10 }}>{resultado.precio}</div>
              <p style={{ fontSize: 14, color: T.dim, lineHeight: 1.7, maxWidth: 440, margin: '0 auto 14px' }}>{resultado.descripcion}</p>
              <div style={{ background: `${resultado.color}12`, border: `1px solid ${resultado.color}30`, borderRadius: 8, padding: '12px 16px', fontSize: 13, fontStyle: 'italic', color: T.text, maxWidth: 440, margin: '0 auto' }}>
                "{resultado.insight}"
              </div>
            </div>

            <div style={{ background: T.ink1, border: `1px solid ${T.bs}`, borderRadius: 12, padding: '18px 20px', marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.dim, textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 12 }}>Qué incluye</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {resultado.incluye.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.text }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.ok} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {/* PDF */}
              <button onClick={descargarPDF}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: resultado.color, color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 28px ${resultado.color}44` }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Descargar mi diagnóstico en PDF
              </button>

              {/* WhatsApp — solo el CTA, sin mensaje largo */}
              <a href="https://wa.me/5493853142987" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'transparent', border: `1px solid ${T.bs}`, color: T.text, textDecoration: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 600 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.ok} strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                Hablar con un especialista
              </a>

              <button onClick={() => { setPaso(0); setRespuestas({}); setNombre(''); setEmpresa(''); setTelefono('') }}
                style={{ background: 'transparent', border: 'none', color: T.dim, borderRadius: 10, padding: '10px', fontSize: 12, cursor: 'pointer' }}>
                Volver a empezar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}