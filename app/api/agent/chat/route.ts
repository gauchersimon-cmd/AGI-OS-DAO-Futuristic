import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export const maxDuration = 30

// Use @ai-sdk/openai directly (no Vercel Gateway - fixes zod v4 error)
const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY || "demo" })

const PROMPTS: Record<string, string> = {
  reasoning: "Tu es un Agent Raisonnement. Analyse logique, decomposition de problemes, explication claire.",
  vision: "Tu es un Agent Vision. Analyse visuelle, patterns, concepts de design.",
  language: "Tu es un Agent Language. NLP, traduction, analyse grammaticale.",
  code: "Tu es un Agent Code. Code propre, debug, review, tous langages.",
  research: "Tu es un Agent Recherche. Synthese, verification, analyse approfondie.",
  analysis: "Tu es un Agent Data. Stats, patterns, tendances, insights.",
}

export async function POST(req: Request) {
  try {
    const { messages, agentId, specialization } = await req.json()
    const system = PROMPTS[specialization?.toLowerCase()] || `Agent ${agentId} - ${specialization || 'general'}`

    // Demo mode if no API key
    if (!process.env.OPENAI_API_KEY) {
      const demo = `[Mode Demo] Je suis ${agentId} (${specialization}).\n\nPour activer l'IA:\n1. Settings > Vars\n2. Ajoute OPENAI_API_KEY\n\nOu visite /setup pour le guide complet!`
      const encoder = new TextEncoder()
      return new Response(new ReadableStream({
        start(c) { c.enqueue(encoder.encode(`0:"${demo.replace(/\n/g, '\\n')}"\n`)); c.close() }
      }), { headers: { "Content-Type": "text/plain" } })
    }

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system,
      messages: (messages || []).map((m: any) => ({ role: m.role, content: String(m.content || '') })),
    })

    return result.toDataStreamResponse()
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}
