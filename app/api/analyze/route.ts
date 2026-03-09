import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getNegocio } from '@/lib/simulated-businesses'
import { calcularMetricas } from '@/lib/metrics'
import { buildDiagnosticPrompt } from '@/lib/prompts'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { negocioId } = await req.json()

    if (!negocioId) {
      return NextResponse.json({ error: 'negocioId requerido' }, { status: 400 })
    }

    const negocio = getNegocio(negocioId)
    if (!negocio) {
      return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })
    }

    const metricas = calcularMetricas(negocio.ventas, negocio.stock, negocio.marketing)
    const prompt = buildDiagnosticPrompt(negocio.nombre, negocio.rubro, negocio.ciudad, metricas)

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawText = message.content
      .filter(b => b.type === 'text')
      .map(b => (b as any).text)
      .join('')

    let diagnostico
    try {
      diagnostico = JSON.parse(rawText)
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/)
      if (match) {
        diagnostico = JSON.parse(match[0])
      } else {
        throw new Error('Respuesta de IA no válida')
      }
    }

    return NextResponse.json({
      negocio: {
        id: negocio.id,
        nombre: negocio.nombre,
        rubro: negocio.rubro,
        ciudad: negocio.ciudad,
        tier: negocio.tier,
        avatar: negocio.avatar,
        color: negocio.color,
      },
      metricas,
      diagnostico,
    })

  } catch (error: any) {
    console.error('[InsightPilot API Error]', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}