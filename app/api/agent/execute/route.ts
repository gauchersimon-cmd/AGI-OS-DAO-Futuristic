import { z } from "zod"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

interface ExecuteRequest {
  agentId: string
  task: string
  specialization: string
}

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { agentId, task, specialization }: ExecuteRequest = await req.json()

    // Forward to Litestar backend
    const response = await fetch(`${BACKEND_URL}/api/agents/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        agent_id: agentId,
        task,
        specialization,
      }),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`)
    }

    const result = await response.json()

    // Transform to streaming response
    const text = result.response || result.message || JSON.stringify(result)
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
    console.error("Execute API error:", error)
    return new Response(JSON.stringify({ error: "Failed to execute agent task" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
