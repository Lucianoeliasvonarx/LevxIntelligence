'use client'

import { useMemo, useState } from 'react'

type Option = {
  id: string
  label: string
  points: number
}

type Question = {
  id: string
  title: string
  subtitle?: string
  options: Option[]
}

type ResultTier = {
  key: 'base' | 'growth' | 'advanced'
  badge: string
  title: string
  description: string
  bullets: string[]
  primaryCta: string
  secondaryCta: string
}

type Props = {
  whatsappHref?: string
  demoHref?: string
  sectionId?: string
}

const TOKENS = {
  bg: '#060E1A',
  bgSoft: '#091425',
  bgCard: 'rgba(9, 20, 37, 0.82)',
  bgCardStrong: 'rgba(12, 26, 48, 0.95)',
  border: 'rgba(76, 142, 240, 0.18)',
  borderStrong: 'rgba(76, 142, 240, 0.32)',
  text: '#E8EEF8',
  textSoft: '#B9C7DE',
  textDim: '#7A90B4',
  primary: '#4C8EF0',
  primaryStrong: '#2D42CC',
  primarySoft: 'rgba(76, 142, 240, 0.14)',
  glow: '0 0 0 1px rgba(76,142,240,.08), 0 24px 80px rgba(6,14,26,.55)',
  radiusXL: 24,
  radiusLG: 18,
  radiusMD: 14,
}

const QUESTIONS: Question[] = [
  {
    id: 'data',
    title: '¿Qué tan ordenados están hoy los datos de tu negocio?',
    subtitle: 'Pensá en ventas, stock, campañas, clientes y seguimiento comercial.',
    options: [
      { id: 'chaos', label: 'Todo está disperso entre WhatsApp, Excel y memoria', points: 1 },
      { id: 'mixed', label: 'Tenemos algunos datos, pero no están conectados', points: 2 },
      { id: 'basic', label: 'Medimos lo básico, pero sin lectura estratégica', points: 3 },
      { id: 'solid', label: 'Ya trabajamos con datos bastante ordenados', points: 4 },
    ],
  },
  {
    id: 'visibility',
    title: '¿Qué tan claro tenés hoy qué está funcionando y qué no?',
    subtitle: 'Sobre todo en publicidad, ventas y rendimiento comercial.',
    options: [
      { id: 'blind', label: 'No lo sé con precisión', points: 1 },
      { id: 'partial', label: 'Tengo una idea, pero no una visión completa', points: 2 },
      { id: 'reports', label: 'Veo algunos números, pero me cuesta interpretarlos', points: 3 },
      { id: 'clear', label: 'Tengo bastante claridad para decidir', points: 4 },
    ],
  },
  {
    id: 'scale',
    title: '¿Qué nivel de control necesitás para crecer?',
    subtitle: 'No es lo mismo vender un poco más que escalar con previsibilidad.',
    options: [
      { id: 'basic', label: 'Solo quiero una lectura simple para ordenar el negocio', points: 1 },
      { id: 'medium', label: 'Quiero detectar fugas y oportunidades rápido', points: 2 },
      { id: 'growth', label: 'Necesito un sistema para decidir mejor y vender más', points: 3 },
      { id: 'high', label: 'Quiero control estratégico real de marketing, ventas y operación', points: 4 },
    ],
  },
  {
    id: 'urgency',
    title: '¿Qué tan urgente es resolver esto?',
    subtitle: 'Mientras más rápido lo resolvés, más rápido corregís pérdidas invisibles.',
    options: [
      { id: 'later', label: 'Lo estoy explorando sin urgencia', points: 1 },
      { id: 'soon', label: 'Quiero resolverlo en las próximas semanas', points: 2 },
      { id: 'now', label: 'Necesito mover esto cuanto antes', points: 3 },
      { id: 'critical', label: 'Es una prioridad inmediata para el negocio', points: 4 },
    ],
  },
]

function getResult(total: number): ResultTier {
  if (total <= 7) {
    return {
      key: 'base',
      badge: 'Nivel recomendado',
      title: 'Diagnóstico Base',
      description:
        'Tu negocio necesita primero ordenar, visualizar y centralizar datos clave para dejar de decidir a ciegas.',
      bullets: [
        'Unificar información crítica en una sola vista',
        'Detectar desorden comercial y métricas ausentes',
        'Empezar a medir lo esencial sin complejidad innecesaria',
      ],
      primaryCta: 'Quiero mi diagnóstico por WhatsApp',
      secondaryCta: 'Ver una demo rápida',
    }
  }

  if (total <= 11) {
    return {
      key: 'growth',
      badge: 'Nivel recomendado',
      title: 'Diagnóstico Growth',
      description:
        'Tu negocio ya tiene algo de estructura, pero necesita convertir datos en decisiones más rápidas y rentables.',
      bullets: [
        'Cruzar marketing, ventas y operación en un solo panel',
        'Identificar fugas del embudo y puntos de mejora',
        'Ganar claridad para optimizar inversión y seguimiento',
      ],
      primaryCta: 'Quiero revisar mi caso por WhatsApp',
      secondaryCta: 'Agendar una demo',
    }
  }

  return {
    key: 'advanced',
    badge: 'Nivel recomendado',
    title: 'Diagnóstico Advanced',
    description:
      'Tu negocio está listo para una capa más estratégica de análisis y control para escalar con mayor precisión.',
    bullets: [
      'Medición avanzada para decisiones comerciales serias',
      'Mayor lectura del