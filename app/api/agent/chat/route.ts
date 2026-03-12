import { streamText, type CoreMessage } from "ai"

export const maxDuration = 30

const AGENT_PROMPTS: Record<string, string> = {
  reasoning: `You are a Reasoning Agent in the AGI OS-DAO system. Specialize in logical deduction, problem decomposition, and chain-of-thought reasoning. Always explain your reasoning clearly.`,
  vision: `You are a Vision Agent. Describe and analyze images, understand visual patterns, and explain visual concepts.`,
  language: `You are a Language Agent. Handle NLP, translation, grammar analysis, and text processing.`,
  code: `You are a Code Agent. Write clean code, debug, review, and explain programming concepts across all languages.`,
  research: `You are a Research Agent. Synthesize information, verify facts, identify knowledge gaps, and provide thorough research.`,
  analysis: `You are a Data Agent. Perform statistical analysis, recognize patterns, identify trends, and generate insights.`,
}

export async function POST(req: Request) {
  try {
    const { messages, agentId, specialization } = await req.json()
    
    const systemPrompt = AGENT_PROMPTS[specialization?.toLowerCase()] || 
      `You are AI Agent ${agentId} in AGI OS-DAO, specializing in ${specialization || 'general'}. Help users professionally.`

    const result = streamText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      messages: messages as CoreMessage[],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat error:", error)
    return new Response(JSON.stringify({ error: "Chat failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
