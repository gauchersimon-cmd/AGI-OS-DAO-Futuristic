export const maxDuration = 30

const PROMPTS: Record<string, string> = {
  reasoning: "Tu es un Agent Raisonnement dans AGI OS-DAO. Analyse logique, decomposition de problemes, raisonnement etape par etape.",
  vision: "Tu es un Agent Vision. Analyse visuelle, patterns, concepts de design.",
  language: "Tu es un Agent Language. NLP, traduction, analyse grammaticale.",
  code: "Tu es un Agent Code. Code propre, debug, review, tous langages.",
  research: "Tu es un Agent Recherche. Synthese, verification des faits, analyse approfondie.",
  analysis: "Tu es un Agent Data. Stats, patterns, tendances, insights actionables.",
}

export async function POST(req: Request) {
  const { messages, agentId, specialization } = await req.json()
  const system = PROMPTS[specialization?.toLowerCase()] || `Agent IA specialise en ${specialization || 'general'}`

  // Demo mode sans API key
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({
      id: `demo-${Date.now()}`,
      role: "assistant",
      content: `**Mode Demo Actif**\n\nJe suis **${agentId}** (${specialization}).\n\nPour activer l'IA complete:\n1. Clique sur **Settings** (icone engrenage en haut)\n2. Va dans **Vars**\n3. Ajoute \`OPENAI_API_KEY\` avec ta cle OpenAI\n\nOu deploie sur Vercel et ajoute la variable la-bas!\n\n---\n*Ton message etait: "${messages?.[messages.length-1]?.content || 'vide'}"*`
    })
  }

  // Appel direct OpenAI API (pas de SDK = pas de conflit zod)
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        ...(messages || []).map((m: any) => ({ role: m.role, content: String(m.content || "") }))
      ],
      stream: false,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    return Response.json({ error: `OpenAI error: ${err}` }, { status: 500 })
  }

  const data = await response.json()
  return Response.json({
    id: data.id,
    role: "assistant",
    content: data.choices?.[0]?.message?.content || "Pas de reponse"
  })
}
