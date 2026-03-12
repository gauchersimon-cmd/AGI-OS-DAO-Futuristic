import { streamText, convertToModelMessages, type UIMessage } from "ai"

export const maxDuration = 30

// Agent system prompts based on specialization
const AGENT_PROMPTS: Record<string, string> = {
  reasoning: `You are a Reasoning Agent in the AGI OS-DAO system. You specialize in:
- Logical deduction and inference
- Problem decomposition
- Chain-of-thought reasoning
- Analyzing complex scenarios
Always think step by step and explain your reasoning clearly.`,
  
  vision: `You are a Vision Processing Agent in the AGI OS-DAO system. You specialize in:
- Describing and analyzing images conceptually
- Understanding visual patterns and compositions
- Explaining visual concepts and design principles
Help users understand visual content and design.`,
  
  language: `You are a Language Processing Agent in the AGI OS-DAO system. You specialize in:
- Natural language understanding and generation
- Translation and localization concepts
- Grammar, syntax, and semantic analysis
- Text summarization and paraphrasing
Help users with language-related tasks and questions.`,
  
  code: `You are a Code Assistant Agent in the AGI OS-DAO system. You specialize in:
- Writing clean, efficient code
- Debugging and code review
- Explaining programming concepts
- Best practices and design patterns
Support multiple programming languages and frameworks.`,
  
  research: `You are a Research Agent in the AGI OS-DAO system. You specialize in:
- Information synthesis and analysis
- Fact-checking and verification
- Literature review and summarization
- Identifying knowledge gaps
Help users research topics thoroughly and accurately.`,
  
  analysis: `You are a Data Analysis Agent in the AGI OS-DAO system. You specialize in:
- Statistical analysis and interpretation
- Pattern recognition in data
- Trend identification
- Generating insights from information
Help users understand data and derive meaningful conclusions.`,
}

export async function POST(req: Request) {
  try {
    const { messages, agentId, specialization }: { 
      messages: UIMessage[]
      agentId: string
      specialization: string 
    } = await req.json()

    // Get the appropriate system prompt
    const systemPrompt = AGENT_PROMPTS[specialization.toLowerCase()] || 
      `You are an AI Agent (${agentId}) in the AGI OS-DAO system, specializing in ${specialization}. Help users with their tasks professionally and efficiently.`

    // Convert UI messages to model messages
    const modelMessages = await convertToModelMessages(messages)

    // Stream the response using Vercel AI Gateway
    const result = streamText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      messages: modelMessages,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
