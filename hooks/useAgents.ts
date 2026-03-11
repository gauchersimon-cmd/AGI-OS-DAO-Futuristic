import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '@/lib/store'
import type { Agent } from '@/lib/store'

export const useAgents = () => {
  const { agents, setAgents } = useAppStore()
  const queryClient = useQueryClient()

  const fetchAgents = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const res = await fetch('/api/agent/list')
      if (!res.ok) throw new Error('Failed to fetch agents')
      const data = await res.json()
      setAgents(data.agents || [])
      return data.agents || []
    },
    staleTime: 1000 * 60 * 5,
  })

  const createAgent = useMutation({
    mutationFn: async (newAgent: Omit<Agent, 'id' | 'lastActive'>) => {
      const res = await fetch('/api/agent/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAgent),
      })
      if (!res.ok) throw new Error('Failed to create agent')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
  })

  const updateAgent = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Agent> }) => {
      const res = await fetch(`/api/agent/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update agent')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
  })

  return {
    agents,
    isLoading: fetchAgents.isPending,
    error: fetchAgents.error,
    createAgent: createAgent.mutate,
    updateAgent: updateAgent.mutate,
  }
}
