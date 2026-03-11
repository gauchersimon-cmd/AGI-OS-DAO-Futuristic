import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return supabaseClient
}

export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// Agent types
export interface Agent {
  id: string
  name: string
  type: "reasoning" | "vision" | "language" | "code" | "research" | "analysis"
  status: "active" | "idle" | "paused"
  workload: number
  tasks_completed: number
  success_rate: number
  created_at: string
  updated_at: string
}

// Memory types
export interface Memory {
  id: string
  agent_id?: string
  type: "conversation" | "decision" | "learning" | "observation"
  content: string
  importance: "low" | "medium" | "high"
  tags: string[]
  access_count: number
  created_at: string
}

// Knowledge base types
export interface KnowledgeEntry {
  id: string
  title: string
  type: "article" | "documentation" | "research"
  content: string
  tags: string[]
  access_count: number
  created_at: string
  updated_at: string
}

// Tool types
export interface Tool {
  id: string
  name: string
  category: "ai" | "data" | "integration" | "utility"
  description: string
  cost: number
  rating: number
  downloads: number
  installed: boolean
  created_at: string
}

// Proposal types
export interface Proposal {
  id: string
  title: string
  description: string
  category: "technical" | "economic" | "governance" | "community"
  status: "active" | "passed" | "rejected"
  votes_for: number
  votes_against: number
  votes_abstain: number
  quorum_required: number
  created_by?: string
  created_at: string
  ends_at?: string
}

// Database operations
export const db = {
  // Agents
  async getAgents() {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("agents").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data as Agent[]
  },

  async createAgent(agent: Omit<Agent, "id" | "created_at" | "updated_at">) {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("agents").insert(agent).select().single()

    if (error) throw error
    return data as Agent
  },

  async updateAgent(id: string, updates: Partial<Agent>) {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("agents")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as Agent
  },

  async deleteAgent(id: string) {
    const supabase = getSupabase()
    const { error } = await supabase.from("agents").delete().eq("id", id)

    if (error) throw error
  },

  // Memories
  async getMemories() {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("memories").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data as Memory[]
  },

  async createMemory(memory: Omit<Memory, "id" | "created_at">) {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("memories").insert(memory).select().single()

    if (error) throw error
    return data as Memory
  },

  // Knowledge Base
  async getKnowledgeEntries() {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("knowledge_base").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data as KnowledgeEntry[]
  },

  async createKnowledgeEntry(entry: Omit<KnowledgeEntry, "id" | "created_at" | "updated_at">) {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("knowledge_base").insert(entry).select().single()

    if (error) throw error
    return data as KnowledgeEntry
  },

  // Tools
  async getTools() {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("tools").select("*").order("rating", { ascending: false })

    if (error) throw error
    return data as Tool[]
  },

  async toggleToolInstallation(id: string, installed: boolean) {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("tools").update({ installed }).eq("id", id).select().single()

    if (error) throw error
    return data as Tool
  },

  // Proposals
  async getProposals() {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("proposals").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data as Proposal[]
  },

  async createProposal(proposal: Omit<Proposal, "id" | "created_at">) {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("proposals").insert(proposal).select().single()

    if (error) throw error
    return data as Proposal
  },

  async voteOnProposal(proposalId: string, voteType: "for" | "against" | "abstain", votingPower: number) {
    const supabase = getSupabase()

    // Update proposal vote counts
    const field = voteType === "for" ? "votes_for" : voteType === "against" ? "votes_against" : "votes_abstain"

    const { data, error } = await supabase.rpc("increment_vote", {
      proposal_id: proposalId,
      vote_field: field,
      amount: votingPower,
    })

    if (error) {
      // Fallback: fetch, update, and save
      const { data: proposal } = await supabase.from("proposals").select("*").eq("id", proposalId).single()

      if (proposal) {
        const updates = {
          votes_for: proposal.votes_for,
          votes_against: proposal.votes_against,
          votes_abstain: proposal.votes_abstain,
        }
        updates[field] += votingPower

        await supabase.from("proposals").update(updates).eq("id", proposalId)
      }
    }
  },
}
