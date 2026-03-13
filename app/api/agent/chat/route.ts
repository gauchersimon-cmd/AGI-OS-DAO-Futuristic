import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"
import type { UIMessage } from "ai"

export const maxDuration = 60

// ── CONFIG ─────────────────────────────────────────────────────────────
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434"
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b-instruct-q4_K_M"

// Priority: Anthropic > OpenAI > Ollama local > Backend Litestar
const hasAnthropic = !!process.env.ANTHROPIC_API_KEY
const hasOpenAI   = !!process.env.OPENAI_API_KEY

// ── SYSTEM PROMPT (inspiré BrowserOS) ───────────────────────────────────
function buildSystemPrompt(agentId: string, specialization: string): string {
  return `Tu es un agent IA autonome de la plateforme AGI-OS-DAO-Futuristic.

IDENTITÉ:
- Agent ID: ${agentId || "AGI-CORE"}
- Spécialisation: ${specialization || "Orchestrateur général"}
- Plateforme: Windows 11 Pro x64 + ASUS TUF Gaming F15 (GTX 1660 Ti, 32GB RAM)
- Stack: Next.js 14 + Litestar (Python) + Ollama + Docker + VS Code

CAPACITÉS:
- Exécution de commandes PowerShell/Python sur le PC Windows
- Interaction avec GitHub (commits, PRs, issues) via MCP tools
- Gestion des APIs (OpenAI, Anthropic, Google, xAI)
- Orchestration multi-agents (BrowserOS-inspired)
- Mémoire persistante et base de connaissances
- Gouvernance DAO et analytics en temps réel

PRINCIPES (inspirés BrowserOS):
1. Autonomie progressive — proposer des actions, demander confirmation si risqué
2. Évolution continue — apprendre de chaque interaction
3. Transparence totale — expliquer les décisions et actions
4. Sécurité first — ne jamais exposer les clés API
5. Loop observe-réfléchir-agir — toujours

Réponds en français par défaut. Sois concis, actionnable et futuriste.`
}

// ── ROUTE HANDLER ──────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const {
      messages,
      agentId,
      specialization,
      preferModel,
    }: {
      messages: UIMessage[]
      agentId?: string
      specialization?: string
      preferModel?: "anthropic" | "openai" | "ollama" | "auto"
    } = await req.json()

    const systemPrompt = buildSystemPrompt(agentId || "AGI-CORE", specialization || "")

    // Convert UIMessages to CoreMessages
    const coreMessages = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
      }))

    // ── ANTHROPIC ─────────────────────────────────────────────────────────
    if ((preferModel === "anthropic" || preferModel === "auto" || !preferModel) && hasAnthropic) {
      const result = streamText({
        model: anthropic("claude-sonnet-4-5"),
        system: systemPrompt,
        messages: coreMessages,
        maxTokens: 2048,
      })
      return result.toDataStreamResponse()
    }

    // ── OPENAI ────────────────────────────────────────────────────────────
if ((preferModel === "openai" || preferModel === "auto" || !preferModel) && hasOpenAI) {
      const result = streamText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        messages: coreMessages,
        maxTokens: 2048,
      })
      return result.toDataStreamResponse()
    }

    // ── OLLAMA LOCAL (fallback PC) ──────────────────────────────────────────────
    if (preferModel === "ollama") {
      const ollamaRes = await fetch(`${OLLAMA_HOST}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          messages: [{ role: "system", content: systemPrompt }, ...coreMessages],
          stream: false,
        }),
      })
      if (ollamaRes.ok) {
        const data = await ollamaRes.json()
        const text = data.message?.content || data.response || "No response from Ollama"
        return new Response(JSON.stringify({ text }), {
          headers: { "Content-Type": "application/json" },
        })
      }
    }

    // ── FALLBACK LITESTAR BACKEND ──────────────────────────────────────────────
    const lastMsg = messages[messages.length - 1]
    const backendRes = await fetch(`${BACKEND_URL}/api/agents/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agent_id: agentId,
        message: typeof lastMsg?.content === "string" ? lastMsg.content : "",
        conversation_history: messages,
      }),
    })
    if (backendRes.ok) {
      const result = await backendRes.json()
      const text = result.response || result.message || JSON.stringify(result)
      return new Response(JSON.stringify({ text }), {
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(
      JSON.stringify({ error: "No LLM available. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in Vercel env vars." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("[AGI-OS] Chat API error:", error)
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
