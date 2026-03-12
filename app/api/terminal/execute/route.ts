import { generateText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { command } = await req.json()

  try {
    const [cmd, ...args] = command.trim().split(" ")
    const argText = args.join(" ")

    // Local commands (no AI)
    if (cmd === "help") return Response.json({ output: "help | echo TEXT | date | version | system.status | agent.list | ai QUESTION", success: true, clear: false })
    if (cmd === "date") return Response.json({ output: new Date().toISOString(), success: true, clear: false })
    if (cmd === "version") return Response.json({ output: "AGI OS-DAO v1.0.0 (AI SDK 5 + Vercel Gateway)", success: true, clear: false })
    if (cmd === "echo") return Response.json({ output: argText || "", success: true, clear: false })
    if (cmd === "system.status") return Response.json({ output: "CPU: 42% | Memory: 58% | Agents: 6 | Health: OPTIMAL", success: true, clear: false })
    if (cmd === "agent.list") return Response.json({ output: "1. Reasoning | 2. Vision | 3. Language | 4. Code | 5. Research | 6. Analysis", success: true, clear: false })

    // AI command
    if (cmd === "ai") {
      if (!argText) return Response.json({ output: "Usage: ai <question>", success: false, clear: false })
      
      const result = await generateText({
        model: "openai/gpt-4o-mini",
        system: "You are an AI assistant in AGI OS-DAO terminal. Provide concise, helpful responses in plain text.",
        prompt: argText,
      })

      return Response.json({ output: result.text, success: true, clear: false })
    }

    return Response.json({ output: `Unknown command: ${cmd}. Type 'help' for commands.`, success: false, clear: false })
  } catch (error) {
    return Response.json({
      output: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      success: false,
      clear: false,
    }, { status: 500 })
  }
}
