import { create } from 'zustand'
import { DevTools } from 'zustand/middleware'

// Types
export interface Agent {
  id: string
  name: string
  type: 'reasoning' | 'vision' | 'language' | 'code' | 'research' | 'analysis'
  status: 'idle' | 'running' | 'paused' | 'error'
  specialization: string
  lastActive: Date
}

export interface Task {
  id: string
  agentId: string
  command: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  output?: string
  error?: string
  createdAt: Date
  completedAt?: Date
}

export interface TerminalState {
  lines: Array<{
    type: 'command' | 'output' | 'error' | 'success' | 'info'
    content: string
    timestamp: Date
  }>
}

// Zustand Store
interface AppStore {
  // Agents
  agents: Agent[]
  setAgents: (agents: Agent[]) => void
  addAgent: (agent: Agent) => void
  updateAgent: (id: string, updates: Partial<Agent>) => void
  removeAgent: (id: string) => void
  
  // Tasks
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void
  
  // Terminal
  terminalLines: TerminalState['lines']
  addTerminalLine: (type: TerminalState['lines'][0]['type'], content: string) => void
  clearTerminal: () => void
  
  // UI State
  isLoading: boolean
  setLoading: (loading: boolean) => void
  selectedAgent: string | null
  setSelectedAgent: (id: string | null) => void
}

export const useAppStore = create<AppStore>((set) => ({
  // Agents
  agents: [],
  setAgents: (agents) => set({ agents }),
  addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),
  updateAgent: (id, updates) => set((state) => ({
    agents: state.agents.map((a) => a.id === id ? { ...a, ...updates } : a)
  })),
  removeAgent: (id) => set((state) => ({
    agents: state.agents.filter((a) => a.id !== id)
  })),
  
  // Tasks
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updates } : t)
  })),
  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id)
  })),
  
  // Terminal
  terminalLines: [
    {
      type: 'info',
      content: 'AGI OS-DAO Terminal v3.0.0 - Ready',
      timestamp: new Date(),
    },
  ],
  addTerminalLine: (type, content) => set((state) => ({
    terminalLines: [...state.terminalLines, { type, content, timestamp: new Date() }]
  })),
  clearTerminal: () => set({
    terminalLines: [{
      type: 'success',
      content: 'Terminal cleared',
      timestamp: new Date(),
    }]
  }),
  
  // UI State
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  selectedAgent: null,
  setSelectedAgent: (id) => set({ selectedAgent: id }),
}))
