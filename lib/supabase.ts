// Mock database - Supabase integration disabled for now
// All data is stored in memory and will reset on page refresh

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
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
  icon?: string
  provider?: string
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

// In-memory mock data stores
const mockAgents: Agent[] = [
  {
    id: "agent-1",
    name: "Reasoning Engine",
    type: "reasoning",
    status: "active",
    workload: 87.4,
    tasks_completed: 142,
    success_rate: 96.5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "agent-2",
    name: "Vision Processor",
    type: "vision",
    status: "active",
    workload: 72.1,
    tasks_completed: 89,
    success_rate: 94.2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "agent-3",
    name: "Language Model",
    type: "language",
    status: "active",
    workload: 91.5,
    tasks_completed: 256,
    success_rate: 98.1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "agent-4",
    name: "Code Assistant",
    type: "code",
    status: "idle",
    workload: 45.2,
    tasks_completed: 178,
    success_rate: 97.8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "agent-5",
    name: "Research Analyst",
    type: "research",
    status: "active",
    workload: 63.8,
    tasks_completed: 67,
    success_rate: 92.4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "agent-6",
    name: "Data Analyzer",
    type: "analysis",
    status: "paused",
    workload: 0,
    tasks_completed: 234,
    success_rate: 95.6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockMemories: Memory[] = [
  {
    id: "mem-1",
    agent_id: "agent-1",
    type: "decision",
    content: "Optimized reasoning chain for complex multi-step problems",
    importance: "high",
    tags: ["optimization", "reasoning"],
    access_count: 42,
    created_at: new Date().toISOString(),
  },
  {
    id: "mem-2",
    agent_id: "agent-3",
    type: "learning",
    content: "Improved context window utilization by 15%",
    importance: "medium",
    tags: ["performance", "nlp"],
    access_count: 28,
    created_at: new Date().toISOString(),
  },
  {
    id: "mem-3",
    type: "observation",
    content: "System load peaks during 9-11 AM UTC",
    importance: "low",
    tags: ["monitoring", "performance"],
    access_count: 15,
    created_at: new Date().toISOString(),
  },
]

const mockKnowledge: KnowledgeEntry[] = [
  {
    id: "kb-1",
    title: "AGI Architecture Principles",
    type: "documentation",
    content: "Core principles for building scalable AGI systems...",
    tags: ["architecture", "agi", "design"],
    access_count: 156,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "kb-2",
    title: "DAO Governance Framework",
    type: "article",
    content: "Governance mechanisms for decentralized AI operations...",
    tags: ["governance", "dao", "voting"],
    access_count: 89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockTools: Tool[] = [
  {
    id: "tool-1",
    name: "Web Search API",
    category: "integration",
    description: "Search the web using DuckDuckGo API",
    cost: 0,
    rating: 4.8,
    downloads: 12450,
    installed: true,
    icon: "Globe",
    provider: "DuckDuckGo",
    created_at: new Date().toISOString(),
  },
  {
    id: "tool-2",
    name: "Code Executor",
    category: "utility",
    description: "Execute code in sandboxed environment",
    cost: 0,
    rating: 4.6,
    downloads: 8920,
    installed: true,
    icon: "Code",
    provider: "Judge0",
    created_at: new Date().toISOString(),
  },
  {
    id: "tool-3",
    name: "Weather API",
    category: "data",
    description: "Get weather data from Open-Meteo",
    cost: 0,
    rating: 4.9,
    downloads: 15670,
    installed: false,
    icon: "Globe",
    provider: "Open-Meteo",
    created_at: new Date().toISOString(),
  },
  {
    id: "tool-4",
    name: "Translation API",
    category: "ai",
    description: "Translate text using MyMemory API",
    cost: 0,
    rating: 4.5,
    downloads: 7840,
    installed: false,
    icon: "MessageSquare",
    provider: "MyMemory",
    created_at: new Date().toISOString(),
  },
  {
    id: "tool-5",
    name: "Image Generator",
    category: "ai",
    description: "Generate images with AI models",
    cost: 50,
    rating: 4.7,
    downloads: 9200,
    installed: false,
    icon: "ImageIcon",
    provider: "Fal.ai",
    created_at: new Date().toISOString(),
  },
  {
    id: "tool-6",
    name: "Document Parser",
    category: "utility",
    description: "Extract and analyze content from documents",
    cost: 0,
    rating: 4.5,
    downloads: 6340,
    installed: true,
    icon: "FileText",
    provider: "DocAI",
    created_at: new Date().toISOString(),
  },
]

const mockProposals: Proposal[] = [
  {
    id: "prop-1",
    title: "Increase Agent Pool Size",
    description: "Proposal to increase the maximum number of concurrent agents from 10 to 20",
    category: "technical",
    status: "active",
    votes_for: 1250,
    votes_against: 340,
    votes_abstain: 89,
    quorum_required: 2000,
    created_at: new Date().toISOString(),
    ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "prop-2",
    title: "Community Treasury Allocation",
    description: "Allocate 10% of treasury to community development initiatives",
    category: "economic",
    status: "active",
    votes_for: 890,
    votes_against: 560,
    votes_abstain: 120,
    quorum_required: 1500,
    created_at: new Date().toISOString(),
    ends_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "prop-3",
    title: "New Governance Model",
    description: "Implement quadratic voting for major decisions",
    category: "governance",
    status: "passed",
    votes_for: 2100,
    votes_against: 450,
    votes_abstain: 200,
    quorum_required: 2000,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Database operations with mock data
export const db = {
  // Agents
  async getAgents(): Promise<Agent[]> {
    return [...mockAgents].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  },

  async createAgent(agent: Omit<Agent, "id" | "created_at" | "updated_at">): Promise<Agent> {
    const newAgent: Agent = {
      ...agent,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockAgents.push(newAgent)
    return newAgent
  },

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
    const index = mockAgents.findIndex(a => a.id === id)
    if (index === -1) throw new Error("Agent not found")
    
    mockAgents[index] = {
      ...mockAgents[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return mockAgents[index]
  },

  async deleteAgent(id: string): Promise<void> {
    const index = mockAgents.findIndex(a => a.id === id)
    if (index !== -1) {
      mockAgents.splice(index, 1)
    }
  },

  // Memories
  async getMemories(): Promise<Memory[]> {
    return [...mockMemories].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  },

  async createMemory(memory: Omit<Memory, "id" | "created_at">): Promise<Memory> {
    const newMemory: Memory = {
      ...memory,
      id: generateId(),
      created_at: new Date().toISOString(),
    }
    mockMemories.push(newMemory)
    return newMemory
  },

  // Knowledge Base
  async getKnowledgeEntries(): Promise<KnowledgeEntry[]> {
    return [...mockKnowledge].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  },

  async createKnowledgeEntry(entry: Omit<KnowledgeEntry, "id" | "created_at" | "updated_at">): Promise<KnowledgeEntry> {
    const newEntry: KnowledgeEntry = {
      ...entry,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockKnowledge.push(newEntry)
    return newEntry
  },

  // Tools
  async getTools(): Promise<Tool[]> {
    return [...mockTools].sort((a, b) => b.rating - a.rating)
  },

  async toggleToolInstallation(id: string, installed: boolean): Promise<Tool> {
    const index = mockTools.findIndex(t => t.id === id)
    if (index === -1) throw new Error("Tool not found")
    
    mockTools[index].installed = installed
    return mockTools[index]
  },

  // Proposals
  async getProposals(): Promise<Proposal[]> {
    return [...mockProposals].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  },

  async createProposal(proposal: Omit<Proposal, "id" | "created_at">): Promise<Proposal> {
    const newProposal: Proposal = {
      ...proposal,
      id: generateId(),
      created_at: new Date().toISOString(),
    }
    mockProposals.push(newProposal)
    return newProposal
  },

  async voteOnProposal(proposalId: string, voteType: "for" | "against" | "abstain", votingPower: number): Promise<void> {
    const proposal = mockProposals.find(p => p.id === proposalId)
    if (!proposal) throw new Error("Proposal not found")
    
    if (voteType === "for") {
      proposal.votes_for += votingPower
    } else if (voteType === "against") {
      proposal.votes_against += votingPower
    } else {
      proposal.votes_abstain += votingPower
    }
  },
}
