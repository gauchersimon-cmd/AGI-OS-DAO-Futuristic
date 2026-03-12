import { generateText } from "ai"

export const maxDuration = 30

interface TerminalResponse {
  output: string
  success: boolean
  error?: string
  clear: boolean
}

export async function POST(req: Request) {
  const { command } = await req.json()

  try {
    const [cmd, ...args] = command.trim().split(" ")
    const argText = args.join(" ")

    // Handle AI command
    if (cmd === "ai") {
      if (!argText) {
        return Response.json({
          output: "Usage: ai <your question>",
          success: false,
          clear: false,
        })
      }

      const result = await generateText({
        model: "openai/gpt-4o-mini",
        system: `You are an AI assistant integrated into the AGI OS-DAO terminal. 
You provide concise, helpful responses formatted for terminal output.
Keep responses brief and use simple formatting.
Do not use markdown - use plain text only.`,
        prompt: argText,
      })

      return Response.json({
        output: result.text,
        success: true,
        clear: false,
      })
    }

    // Unknown command passed to API (should be handled client-side)
    return Response.json({
      output: `Command "${cmd}" should be handled locally`,
      success: false,
      clear: false,
    })

  } catch (error) {
    console.error("Terminal execute error:", error)
    return Response.json(
      {
        output: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        success: false,
        clear: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
