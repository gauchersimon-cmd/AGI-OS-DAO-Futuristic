import type { UIMessage } from "ai"

export const maxDuration = 30

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

export async function POST(req: Request) {
  try {
    const { messages, agentId, specialization }: { messages: UIMessage[]; agentId: string; specialization: string } =
      await req.json()

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== "user") {
      return new Response("Invalid message format", { status: 400 })
    }

    const userMessage = lastMessage.content || ""

    // Forward to Litestar backend
    const response = await fetch(`${BACKEND_URL}/api/agents/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        agent_id: agentId,
        message: userMessage,
        conversation_history: messages,
      }),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`)
    }

    const result = await response.json()

    // Transform backend response to streaming format
    const text = result.response || result.message || JSON.stringify(result)

    // Return as a text stream
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(text))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
