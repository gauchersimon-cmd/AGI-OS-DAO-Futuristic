import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export const maxDuration = 30

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY || "demo" })

export async function POST(req: Request) {
  const { command } = await req.json()
  const [cmd, ...args] = (command || "").trim().split(" ")
  const argText = args.join(" ")
  const json = (output: string, success = true) => Response.json({ output, success, clear: cmd === "clear" })

  if (cmd === "help") return json("help | echo | date | version | clear | system.status | agent.list | ai <q> | platform")
  if (cmd === "date") return json(new Date().toLocaleString())
  if (cmd === "version") return json("AGI OS-DAO v3.0.0 - Cross-Platform")
  if (cmd === "clear") return json("", true)
  if (cmd === "echo") return json(argText)
  if (cmd === "system.status") return json("CPU: 42% | RAM: 58% | Agents: 6 | Status: OPTIMAL")
  if (cmd === "agent.list") return json("1.Reasoning 2.Vision 3.Language 4.Code 5.Research 6.Analysis")
  if (cmd === "platform") return json(`Node ${process.version} | Platform: universal`)
  if (cmd === "whoami") return json("AGI OS-DAO Administrator")

  if (cmd === "ai") {
    if (!argText) return json("Usage: ai <question>", false)
    if (!process.env.OPENAI_API_KEY) return json("[Demo] Configure OPENAI_API_KEY pour activer l'IA")
    try {
      const { text } = await generateText({ model: openai("gpt-4o-mini"), prompt: argText, maxTokens: 500 })
      return json(text)
    } catch (e) { return json(`Erreur: ${e}`, false) }
  }

  return json(`Commande inconnue: ${cmd}. Tape 'help'`, false)
}
