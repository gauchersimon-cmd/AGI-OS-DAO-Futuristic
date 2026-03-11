const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

interface TerminalResponse {
  output: string
  success: boolean
  error?: string
  clear: boolean
}

export async function POST(req: Request) {
  const { command } = await req.json()

  try {
    // Forward to Litestar backend
    const response = await fetch(`${BACKEND_URL}/api/terminal/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ command }),
    })

    if (!response.ok) {
      return Response.json(
        {
          output: `Backend error: ${response.statusText}`,
          success: false,
          clear: false,
        },
        { status: response.status }
      )
    }

    const result: TerminalResponse = await response.json()
    return Response.json(result)
  } catch (error) {
    console.error("Terminal execute error:", error)
    return Response.json(
      {
        output: `Error executing command: ${error instanceof Error ? error.message : "Unknown error"}`,
        success: false,
        clear: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
