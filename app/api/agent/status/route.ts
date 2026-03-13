/**
 * /api/agent/status
 * Retourne le statut des LLMs disponibles (clés configurées)
 * Utilisé par le dashboard pour afficher l'état des APIs
 * Inspiré BrowserOS — observabilité totale
 */
export const runtime = "edge"

export async function GET() {
  const providers = [
    {
      id: "anthropic",
      name: "Anthropic Claude",
      available: !!process.env.ANTHROPIC_API_KEY,
      model: "claude-sonnet-4-5",
      priority: 1,
    },
    {
      id: "openai",
      name: "OpenAI GPT-4o",
      available: !!process.env.OPENAI_API_KEY,
      model: "gpt-4o",
      priority: 2,
    },
    {
      id: "google",
      name: "Google Gemini",
      available: !!process.env.GOOGLE_API_KEY,
      model: "gemini-2.0-flash",
      priority: 3,
    },
    {
      id: "xai",
      name: "xAI Grok",
      available: !!process.env.XAI_API_KEY,
      model: "grok-3",
      priority: 4,
    },
    {
      id: "ollama",
      name: "Ollama (Local PC)",
      available: false, // vérifié côté client uniquement
      model: process.env.OLLAMA_MODEL || "llama3.2:3b",
      priority: 5,
    },
  ]

  const activeProvider = providers.find((p) => p.available) || null

  return Response.json({
    ok: true,
    timestamp: new Date().toISOString(),
    platform: "AGI-OS-DAO-Futuristic",
    version: "2.0.0",
    providers,
    activeProvider,
    config: {
      backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
      ollamaHost: process.env.OLLAMA_HOST || "http://localhost:11434",
    },
  })
}
