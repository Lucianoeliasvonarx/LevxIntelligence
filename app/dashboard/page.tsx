'use client'
import { useState, useEffect, useCallback } from 'react'
import { NEGOCIOS_SIMULADOS } from '@/lib/simulated-businesses'

// ─── TOKENS ────────────────────────────────────────────────
const T = {
  ink:   '#060E1A', ink1: '#091425', ink2: '#0C1A30', ink3: '#112040',
  indigo:'#2D42CC', sky: '#4C8EF0', skyDim: 'rgba(76,142,240,.13)',
  skyB:  'rgba(76,142,240,.22)',
  text:  '#E8EEF8', dim: '#7A90B4', xs: '#4A607E',
  bs:    'rgba(255,255,255,.055)', border: 'rgba(76,142,240,.14)',
  ok:    '#0DB87A', warn: '#E88C0C', danger: '#D94040',
}

// ─── TYPES ─────────────────────────────────────────────────
interface Diagnostico {
  score: number
  score_label: string
  resumen: string
  kpis: Array<{ label: string; valor: string; sub: string; tendencia: 'up'|'down'|'flat' }>
  alertas: Array<{ nivel: 'danger'|'warn'|'ok'; categoria: string; titulo: string; detalle: string; accion_inmediata: string }>
  recomendaciones: Array<{ prioridad: number; titulo: string; plazo: string; impacto: string; detalle: string }>
  productos_criticos: Array<{ nombre: string; estado: string; dato: string }>
  marketing: { roas_promedio: number; cac: number; campanas_ineficientes: string[]; canal_mas_rentable: string; recomendacion: string }
  salud_por_area: { stock: number; ventas: number; margen: number; rotacion: number; marketing: number }
}

interface AnalysisResult {
  negocio: { id: string; nombre: string; rubro: string; ciudad: string; tier: string; avatar: string; color: string }
  metricas: any
  diagnostico: Diagnostico
}

// ─── ICONS ─────────────────────────────────────────────────
const Icon = {
  grid: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  alert: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  trend: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  box: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
  star: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  chart: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  users: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  arrowUp: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>,
  arrowDn: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 9 12 15 6 9"/></svg>,
  minus:   <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>,
  pulse:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  ads:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
}

// ─── HELPERS ───────────────────────────────────────────────
const fmt = (n: number) => n >= 1_000_000 ? `$${(n/1_000_000).toFixed(1)}M` : n >= 1000 ? `$${(n/1000).toFixed(0)}K` : `$${n.toLocaleString('es-AR')}`
const scoreColor = (s: number) => s >= 80 ? T.ok : s >= 65 ? T.sky : s >= 45 ? T.warn : T.danger
const alertColor = (n: string) => n === 'danger' ? T.danger : n === 'warn' ? T.warn : T.ok

// ─── COMPONENTS ────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: T.ink1, border: `1px solid ${T.bs}`, borderRadius: 14, padding: '20px 22px', ...style }}>
      {children}
    </div>
  )
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', color: T.dim, marginBottom: 16 }}>
      {children}
    </div>
  )
}

function HealthGauge({ score, areas }: { score: number; areas: Record<string, number> }) {
  const pct = score / 100
  const circumference = 2 * Math.PI * 64
  const dash = pct * circumference * 0.82
  const color = scoreColor(score)
  const label = score >= 80 ? 'Excelente' : score >= 65 ? 'Saludable' : score >= 45 ? 'En riesgo' : 'Crítico'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div style={{ position: 'relative', width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          <defs>
            <linearGradient id="gg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={T.indigo}/>
              <stop offset="100%" stopColor={color}/>
            </linearGradient>
          </defs>
          <circle cx="80" cy="80" r="64" fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="8"/>
          <circle cx="80" cy="80" r="64" fill="none" stroke="url(#gg)" strokeWidth="8"
            strokeDasharray={`${dash} ${circumference}`}
            strokeDashoffset={circumference * 0.09}
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
            style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 44, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{score}</div>
          <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 11, fontWeight: 700, color, letterSpacing: '.06em', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
        </div>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {Object.entries(areas).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: T.dim, width: 80, textAlign: 'right', textTransform: 'capitalize' }}>{key}</span>
            <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,.05)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${val}%`, background: `linear-gradient(90deg, ${T.indigo}, ${scoreColor(val)})`, borderRadius: 99, transition: 'width 1.2s ease' }}/>
            </div>
            <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 11, color: T.dim, width: 24, textAlign: 'right' }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AlertItem({ alerta }: { alerta: any }) {
  const col = alertColor(alerta.nivel)
  return (
    <div style={{
      display: 'flex', gap: 11, padding: '13px 14px', borderRadius: 10,
      background: `${col}11`, borderLeft: `3px solid ${col}`,
    }}>
      <div style={{ flexShrink: 0, marginTop: 1 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2">
          {alerta.nivel === 'danger' ? <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></> :
           alerta.nivel === 'warn'   ? <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></> :
           <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>}
        </svg>
      </div>
      <div>
        <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{alerta.titulo}</div>
        <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.55 }}>{alerta.detalle}</div>
        <span style={{
          display: 'inline-block', marginTop: 7, fontSize: 11,
          fontFamily: 'Sora,sans-serif', fontWeight: 700,
          padding: '3px 10px', borderRadius: 99,
          background: `${col}22`, color: col
        }}>{alerta.accion_inmediata}</span>
      </div>
    </div>
  )
}

function RecItem({ rec }: { rec: any }) {
  const plazoCol = rec.plazo === 'Esta semana' ? T.danger : rec.plazo === 'Próximas 2 semanas' ? T.warn : T.sky
  return (
    <div style={{ display: 'flex', gap: 14, background: T.ink2, border: `1px solid ${T.bs}`, borderRadius: 10, padding: '14px 16px' }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(45,66,204,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Sora,sans-serif', fontSize: 12, fontWeight: 800, color: T.sky, flexShrink: 0, border: `1px solid ${T.skyB}` }}>
        {rec.prioridad}
      </div>
      <div>
        <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 5 }}>{rec.titulo}</div>
        <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.6 }}>{rec.detalle}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <span style={{ fontFamily: 'Sora,sans-serif', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: `${plazoCol}18`, color: plazoCol }}>{rec.plazo}</span>
          <span style={{ fontFamily: 'Sora,sans-serif', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: `${T.ok}12`, color: T.ok }}>Impacto {rec.impacto}</span>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN DASHBOARD ────────────────────────────────────────
export default function DashboardPage() {
  const [selectedId, setSelectedId] = useState(NEGOCIOS_SIMULADOS[0].id)
  const [view, setView]     = useState('overview')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [collapsed, setCollapsed] = useState(false)

  const analyze = useCallback(async (id: string) => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ negocioId: id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al analizar')
      setResult(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { analyze(selectedId) }, [selectedId])

  const d = result?.diagnostico
  const m = result?.metricas
  const n = result?.negocio

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: Icon.grid },
    { id: 'alertas',  label: 'Alertas',   icon: Icon.alert, badge: d?.alertas.filter(a => a.nivel === 'danger').length },
    { id: 'ventas',   label: 'Ventas',    icon: Icon.trend },
    { id: 'stock',    label: 'Inventario',icon: Icon.box },
    { id: 'productos',label: 'Productos', icon: Icon.star },
    { id: 'marketing',label: 'Marketing', icon: Icon.ads },
    { id: 'admin',    label: 'Clientes',  icon: Icon.users },
  ]

  const sw = collapsed ? 60 : 220

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'DM Sans, sans-serif', background: T.ink, color: T.text }}>

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside style={{ width: sw, flexShrink: 0, background: T.ink1, borderRight: `1px solid ${T.bs}`, display: 'flex', flexDirection: 'column', transition: 'width .25s ease', overflow: 'hidden' }}>

        {/* Logo */}
        <div style={{ padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${T.bs}`, minHeight: 64 }}>
          <svg width="28" height="31" viewBox="0 0 46 50" fill="none" style={{ flexShrink: 0 }}>
            <rect x="0" y="10" width="6" height="40" fill="#4C8EF0"/>
            <rect x="0" y="44" width="22" height="6" fill="#4C8EF0"/>
            <polygon points="8,0 36,0 46,10 8,10" fill="#4C8EF0"/>
            <rect x="14" y="14" width="5" height="20" fill="white" opacity=".9"/>
            <rect x="22" y="18" width="5" height="16" fill="white" opacity=".7"/>
            <rect x="30" y="22" width="5" height="12" fill="white" opacity=".5"/>
          </svg>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 14, fontWeight: 800, color: '#fff' }}>InsightPilot</div>
              <div style={{ fontSize: 10, color: T.dim }}>by Levx Intelligence</div>
            </div>
          )}
        </div>

        {/* Business selector */}
        {!collapsed && (
          <div style={{ margin: '12px 10px', borderRadius: 10, overflow: 'hidden', border: `1px solid ${T.skyB}` }}>
            {NEGOCIOS_SIMULADOS.map(neg => (
              <div key={neg.id} onClick={() => { setSelectedId(neg.id); setView('overview') }}
                style={{ padding: '9px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9, background: selectedId === neg.id ? T.skyDim : 'transparent', borderBottom: `1px solid ${T.bs}`, transition: 'background .15s' }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: neg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Sora,sans-serif', fontSize: 10, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {neg.avatar}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 11, fontWeight: 700, color: selectedId === neg.id ? '#fff' : T.dim, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>{neg.nombre}</div>
                  <div style={{ fontSize: 9, color: T.xs }}>{neg.rubro}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '4px 0', overflowY: 'auto' }}>
          {navItems.map(item => (
            <div key={item.id} onClick={() => setView(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '9px 0' : '9px 14px',
                margin: '1px 6px', borderRadius: 8, cursor: 'pointer',
                justifyContent: collapsed ? 'center' : 'flex-start',
                fontSize: 13, color: view === item.id ? T.sky : T.dim,
                background: view === item.id ? T.skyDim : 'transparent',
                border: view === item.id ? `1px solid ${T.skyB}` : '1px solid transparent',
                transition: 'all .15s',
              }}>
              {item.icon}
              {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
              {!collapsed && item.badge ? <span style={{ background: T.danger, color: '#fff', borderRadius: 99, padding: '1px 7px', fontSize: 10, fontFamily: 'Sora,sans-serif', fontWeight: 700 }}>{item.badge}</span> : null}
            </div>
          ))}
        </nav>

        {/* Collapse btn */}
        <div style={{ borderTop: `1px solid ${T.bs}`, padding: 12 }}>
          <button onClick={() => setCollapsed(!collapsed)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 8, padding: '8px', borderRadius: 8, background: 'transparent', border: `1px solid ${T.bs}`, color: T.dim, fontSize: 12, cursor: 'pointer', transition: 'all .15s' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {collapsed ? <path d="M9 18l6-6-6-6"/> : <path d="M15 18l-6-6 6-6"/>}
            </svg>
            {!collapsed && <span>Colapsar</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <header style={{ height: 64, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', background: T.ink1, borderBottom: `1px solid ${T.bs}` }}>
          <div>
            <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 16, fontWeight: 800, color: '#fff' }}>
              {navItems.find(i => i.id === view)?.label || 'Dashboard'}
            </div>
            <div style={{ fontSize: 12, color: T.dim }}>
              {n ? `${n.nombre} · ${n.ciudad}` : 'Seleccionando negocio...'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {d && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.skyDim, border: `1px solid ${T.skyB}`, borderRadius: 99, padding: '6px 14px' }}>
                {Icon.pulse}
                <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 16, fontWeight: 500, color: T.sky }}>{d.score}</span>
                <span style={{ fontFamily: 'Sora,sans-serif', fontSize: 10, fontWeight: 700, color: scoreColor(d.score), letterSpacing: '.06em', textTransform: 'uppercase' }}>{d.score_label}</span>
              </div>
            )}
            <button onClick={() => analyze(selectedId)}
              disabled={loading}
              style={{ background: T.indigo, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontFamily: 'Sora,sans-serif', fontSize: 12, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', opacity: loading ? .7 : 1, transition: 'all .15s' }}>
              {loading ? 'Analizando...' : 'Actualizar análisis'}
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

          {/* Loading state */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 20 }}>
              <div style={{ width: 48, height: 48, border: `3px solid ${T.bs}`, borderTop: `3px solid ${T.sky}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }}/>
              <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 14, color: T.dim }}>InsightPilot está analizando el negocio...</div>
              <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div style={{ background: `${T.danger}11`, border: `1px solid ${T.danger}44`, borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, color: T.danger, marginBottom: 6 }}>Error al analizar</div>
              <div style={{ fontSize: 13, color: T.dim }}>{error}</div>
              <div style={{ fontSize: 12, color: T.xs, marginTop: 8 }}>Verificá que ANTHROPIC_API_KEY esté configurada en .env.local</div>
            </div>
          )}

          {/* ── OVERVIEW ────────────────────────────────────── */}
          {!loading && d && view === 'overview' && (
            <div>
              {/* Resumen ejecutivo */}
              <div style={{ background: `${T.sky}09`, border: `1px solid ${T.skyB}`, borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}>{Icon.pulse}</div>
                <div style={{ fontSize: 14, color: T.text, lineHeight: 1.72 }}>{d.resumen}</div>
              </div>

              {/* KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14, marginBottom: 20 }}>
                {d.kpis.map((k, i) => (
                  <Card key={i}>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: T.dim, marginBottom: 8 }}>{k.label}</div>
                    <div style={{ fontFamily: 'DM Mono,monospace', fontSize: 24, fontWeight: 500, color: '#fff', lineHeight: 1 }}>{k.valor}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6, fontSize: 12, color: k.tendencia === 'up' ? T.ok : k.tendencia === 'down' ? T.danger : T.dim }}>
                      {k.tendencia === 'up' ? Icon.arrowUp : k.tendencia === 'down' ? Icon.arrowDn : Icon.minus}
                      {k.sub}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Health + Alertas */}
              <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 16, marginBottom: 16 }}>
                <Card>
                  <CardTitle>Business Health Score</CardTitle>
                  <HealthGauge score={d.score} areas={d.salud_por_area}/>
                </Card>
                <Card>
                  <CardTitle>Alertas activas</CardTitle>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {d.alertas.slice(0, 3).map((a, i) => <AlertItem key={i} alerta={a}/>)}
                    {d.alertas.length > 3 && (
                      <div onClick={() => setView('alertas')} style={{ textAlign: 'center', fontSize: 12, color: T.sky, cursor: 'pointer', padding: '6px 0' }}>
                        Ver {d.alertas.length - 3} alertas más →
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Plan de acción */}
              <Card>
                <CardTitle>Plan de acción</CardTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {d.recomendaciones.slice(0, 2).map((r, i) => <RecItem key={i} rec={r}/>)}
                </div>
              </Card>
            </div>
          )}

          {/* ── ALERTAS ─────────────────────────────────────── */}
          {!loading && d && view === 'alertas' && (
            <div style={{ maxWidth: 720 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {d.alertas.map((a, i) => <AlertItem key={i} alerta={a}/>)}
              </div>
              <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', color: T.dim, marginBottom: 16 }}>Plan de acción completo</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {d.recomendaciones.map((r, i) => <RecItem key={i} rec={r}/>)}
              </div>
            </div>
          )}

          {/* ── VENTAS ──────────────────────────────────────── */}
          {!loading && m && view === 'ventas' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
                <Card>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: T.dim, marginBottom: 8 }}>Ingresos totales</div>
                  <div style={{ fontFamily: 'DM Mono,monospace', fontSize: 26, fontWeight: 500, color: '#fff' }}>{fmt(m.ingresos_totales)}</div>
                  <div style={{ fontSize: 12, color: T.ok, marginTop: 6 }}>Período analizado</div>
                </Card>
                <Card>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: T.dim, marginBottom: 8 }}>Margen bruto</div>
                  <div style={{ fontFamily: 'DM Mono,monospace', fontSize: 26, fontWeight: 500, color: '#fff' }}>{m.margen_porcentaje.toFixed(1)}%</div>
                  <div style={{ fontSize: 12, color: T.dim, marginTop: 6 }}>{fmt(m.margen_bruto)} en valor</div>
                </Card>
                <Card>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: T.dim, marginBottom: 8 }}>Ticket promedio</div>
                  <div style={{ fontFamily: 'DM Mono,monospace', fontSize: 26, fontWeight: 500, color: '#fff' }}>{fmt(m.ticket_promedio)}</div>
                  <div style={{ fontSize: 12, color: T.dim, marginTop: 6 }}>{m.total_transacciones} transacciones</div>
                </Card>
              </div>
              <Card>
                <CardTitle>Ventas por producto</CardTitle>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Producto','Ingresos','Margen %','Unidades','Contribución'].map(h => (
                        <th key={h} style={{ fontFamily: 'Sora,sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: T.xs, padding: '0 12px 10px', textAlign: 'left', borderBottom: `1px solid ${T.bs}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(m.ventas_por_producto as Record<string, any>)
                      .sort((a, b) => b[1].ingresos - a[1].ingresos)
                      .map(([nombre, data]: [string, any]) => {
                        const pct = m.ingresos_totales > 0 ? (data.ingresos / m.ingresos_totales * 100) : 0
                        const margenCol = data.margen >= 40 ? T.ok : data.margen >= 25 ? T.sky : data.margen >= 15 ? T.warn : T.danger
                        return (
                          <tr key={nombre}>
                            <td style={{ padding: '10px 12px', borderBottom: `1px solid ${T.bs}`, fontWeight: 500, color: '#fff', fontSize: 13 }}>{nombre}</td>
                            <td style={{ padding: '10px 12px', borderBottom: `1px solid ${T.bs}`, fontFamily: 'DM Mono,monospace', fontSize: 13, color: T.text }}>{fmt(data.ingresos)}</td>
                            <td style={{ padding: '10px 12px', borderBottom: `1px solid ${T.bs}`, fontFamily: 'DM Mono,monospace', fontSize: 13, color: margenCol }}>{data.margen.toFixed(1)}%</td>
                            <td style={{ padding: '10px 12px', borderBottom: `1px solid ${T.bs}`, fontFamily: 'DM Mono,monospace', fontSize: 13, color: T.dim }}>{data.unidades}</td>
                            <td style={{ padding: '10px 12px', borderBottom: `1px solid ${T.bs}` }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 80, height: 4, background: 'rgba(255,255,255,.05)', borderRadius: 99, overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${pct}%`, background: T.sky, borderRadius: 99 }}/>
                                </div>
                                <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 11, color: T.dim }}>{pct.toFixed(0)}%</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* ── INVENTARIO ──────────────────────────────────── */}
          {!loading && m && view === 'stock' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
                {[
                  { label: 'Quiebre crítico', val: m.productos_quiebre_critico.length, unit: 'productos', col: T.danger },
                  { label: 'Bajo mínimo', val: m.productos_bajo_minimo.length, unit: 'productos', col: T.warn },
                  { label: 'Capital inmovilizado', val: fmt(m.capital_inmovilizado), unit: 'rotación >60 días', col: T.sky },
                  { label: 'Capital total stock', val: fmt(m.capital_total_stock), unit: 'inventario total', col: T.ok },
                ].map((s, i) => (
                  <div key={i} style={{ background: T.ink1, border: `1px solid ${T.bs}`, borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontSize: 11, color: T.dim }}>{s.label}</div>
                    <div style={{ fontFamily: 'DM Mono,monospace', fontSize: 22, fontWeight: 500, color: s.col, margin: '4px 0' }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: T.xs }}>{s.unit}</div>
                  </div>
                ))}
              </div>
              <Card>
                <CardTitle>Estado del inventario por producto</CardTitle>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Producto','Stock actual','Días restantes','Estado','Rotación'].map(h => (
                        <th key={h} style={{ fontFamily: 'Sora,sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: T.xs, padding: '0 12px 10px', textAlign: 'left', borderBottom: `1px solid ${T.bs}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result?.negocio && NEGOCIOS_SIMULADOS.find(n => n.id === result.negocio.id)?.stock.map((item) => {
                      const dias = m.dias_inventario_por_producto[item.producto] || 0
                      const estado = dias <= 5 ? { label: 'Quiebre', col: T.danger } :
                                     item.stock_actual < item.stock_minimo ? { label: 'Bajo mínimo', col: T.warn } :
                                     dias > 90 ? { label: 'Stock muerto', col: T.xs } :
                                     dias > 60 ? { label: 'Exceso', col: T.warn } :
                                     { label: 'Normal', col: T.ok }
                      const pctRotacion = Math.max(0, Math.min(100, 100 - (dias / 120 * 100)))
                      return (
                        <tr key={item.producto}>
                          <td style={{ padding: '10px 12px', borderBottom: `1px solid ${T.bs}`, color: '#fff', fontSize: 13, fontWeight: 500 }}>{item.producto}</td>
                          <td style={{ padding: '10px 12px', borderBottom: `1px solid ${T.bs}`, fontFamily: 'DM Mono,monospace', fontSize: 13 }}>{item.stock_actual} u.</td>
                          <td style={{ padding: '10px 12px', borderBottom: `1px solid ${T.bs}`, fontFamily: 'DM Mono,monospace', fontSize: 13, color: dias <= 7 ? T.danger : dias <= 14 ? T.warn : T.text }}>{dias >= 999 ? 'Sin ventas' : `${dias} días`}</td>
                          <td style={{ padding: '10px 12px', borderBottom: `1px solid ${T.bs}` }}>
                            <span style={{ background: `${estado.col}18`, color: estado.col, fontFamily: 'Sora,sans-serif', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '.05em' }}>{estado.label}</span>
                          </td>
                          <td style={{ padding: '10px 12px', borderBottom: `1px solid ${T.bs}` }}>
                            <div style={{ width: 80, height: 4, background: 'rgba(255,255,255,.05)', borderRadius: 99, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${pctRotacion}%`, background: estado.col, borderRadius: 99 }}/>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* ── PRODUCTOS CRITICOS ──────────────────────────── */}
          {!loading && d && view === 'productos' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
                {d.productos_criticos.map((p, i) => {
                  const col = p.estado === 'estrella' ? T.ok : p.estado === 'quiebre' ? T.danger : p.estado === 'dependencia' ? T.warn : p.estado === 'sobrestock' ? T.warn : T.xs
                  const icon = p.estado === 'estrella' ? Icon.star : p.estado === 'quiebre' ? Icon.alert : Icon.box
                  return (
                    <Card key={i}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: `${col}15`, border: `1px solid ${col}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: col }}>{icon}</div>
                        <span style={{ background: `${col}18`, color: col, fontFamily: 'Sora,sans-serif', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '.05em' }}>{p.estado}</span>
                      </div>
                      <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{p.nombre}</div>
                      <div style={{ fontSize: 13, color: T.dim }}>{p.dato}</div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── MARKETING ───────────────────────────────────── */}
          {!loading && d && m && view === 'marketing' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
                {[
                  { label: 'ROAS promedio', val: `${d.marketing.roas_promedio.toFixed(2)}x`, col: d.marketing.roas_promedio >= 3 ? T.ok : d.marketing.roas_promedio >= 2 ? T.warn : T.danger },
                  { label: 'CAC promedio', val: fmt(d.marketing.cac), col: T.sky },
                  { label: 'Canal más rentable', val: d.marketing.canal_mas_rentable, col: T.ok },
                  { label: 'Campañas ineficientes', val: `${d.marketing.campanas_ineficientes.length}`, col: d.marketing.campanas_ineficientes.length > 0 ? T.danger : T.ok },
                ].map((s, i) => (
                  <Card key={i}>
                    <div style={{ fontSize: 10, fontFamily: 'Sora,sans-serif', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: T.dim, marginBottom: 8 }}>{s.label}</div>
                    <div style={{ fontFamily: 'DM Mono,monospace', fontSize: 20, fontWeight: 500, color: s.col }}>{s.val}</div>
                  </Card>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Card>
                  <CardTitle>ROAS por campaña</CardTitle>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {m.roas_por_campana.map((c: any, i: number) => {
                      const col = c.roas >= 3 ? T.ok : c.roas >= 2 ? T.warn : c.roas > 0 ? T.danger : T.xs
                      return (
                        <div key={i} style={{ padding: '12px 14px', background: T.ink2, borderRadius: 10, border: `1px solid ${T.bs}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{c.campana}</div>
                              <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>{c.canal}</div>
                            </div>
                            <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 18, fontWeight: 500, color: col }}>{c.roas > 0 ? `${c.roas}x` : 'Orgánico'}</span>
                          </div>
                          {c.gasto > 0 && (
                            <div style={{ display: 'flex', gap: 16, fontSize: 11, color: T.dim }}>
                              <span>Gasto: <strong style={{ color: T.text }}>{fmt(c.gasto)}</strong></span>
                              <span>Ingresos: <strong style={{ color: T.ok }}>{fmt(c.ingresos)}</strong></span>
                              <span>CAC: <strong style={{ color: T.sky }}>{fmt(c.cac)}</strong></span>
                            </div>
                          )}
                          {c.gasto > 0 && (
                            <div style={{ marginTop: 8, height: 4, background: 'rgba(255,255,255,.05)', borderRadius: 99, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${Math.min(100, (c.roas / 5) * 100)}%`, background: col, borderRadius: 99 }}/>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </Card>
                <Card>
                  <CardTitle>Recomendación de marketing</CardTitle>
                  <div style={{ background: `${T.sky}09`, border: `1px solid ${T.skyB}`, borderRadius: 10, padding: '16px', fontSize: 14, color: T.text, lineHeight: 1.72, marginBottom: 16 }}>
                    {d.marketing.recomendacion}
                  </div>
                  {d.marketing.campanas_ineficientes.length > 0 && (
                    <div style={{ background: `${T.danger}09`, border: `1px solid ${T.danger}33`, borderRadius: 10, padding: '14px' }}>
                      <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 11, fontWeight: 700, color: T.danger, marginBottom: 8 }}>PAUSAR ESTAS CAMPAÑAS</div>
                      {d.marketing.campanas_ineficientes.map((c, i) => (
                        <div key={i} style={{ fontSize: 13, color: T.dim, padding: '4px 0', borderBottom: `1px solid ${T.bs}` }}>• {c}</div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}

          {/* ── ADMIN ───────────────────────────────────────── */}
          {view === 'admin' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
                {NEGOCIOS_SIMULADOS.map(neg => (
                  <div key={neg.id} onClick={() => { setSelectedId(neg.id); setView('overview') }}
                    style={{ background: T.ink1, border: `1px solid ${neg.id === selectedId ? T.border : T.bs}`, borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'all .2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 10, background: neg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Sora,sans-serif', fontSize: 16, fontWeight: 800, color: '#fff' }}>{neg.avatar}</div>
                      <span style={{ fontFamily: 'Sora,sans-serif', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 4, background: T.skyDim, color: T.sky, textTransform: 'capitalize' }}>
                        {neg.tier}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{neg.nombre}</div>
                    <div style={{ fontSize: 12, color: T.dim }}>{neg.rubro} · {neg.ciudad}</div>
                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.bs}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: T.dim }}>Click para ver dashboard</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.sky} strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
