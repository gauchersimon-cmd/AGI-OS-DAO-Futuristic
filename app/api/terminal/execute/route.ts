export const maxDuration = 30

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
    if (!process.env.OPENAI_API_KEY) return json("[Demo] Configure OPENAI_API_KEY pour l'IA. Va dans Settings > Vars")
    
    // Direct OpenAI call (no SDK)
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: argText }], max_tokens: 500 }),
    })
    if (!res.ok) return json(`OpenAI error: ${await res.text()}`, false)
    const data = await res.json()
    return json(data.choices?.[0]?.message?.content || "Pas de reponse")
  }

  return json(`Commande inconnue: ${cmd}. Tape 'help'`, false)
}
