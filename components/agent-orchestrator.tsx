"use client"

import { useState, useEffect } from "react"
import { Bot, Brain, Eye, MessageSquare, Code, Search, Zap, Play, Pause, Trash2, Settings, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { db, type Agent } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { AgentChat } from "./agent-chat"

type AgentType = "reasoning" | "vision" | "language" | "code" | "research" | "analysis"
type AgentStatus = "active" | "idle" | "paused"

const agentTypeConfig = {
  reasoning: { icon: Brain, color: "cyan", label: "Reasoning" },
  vision: { icon: Eye, color: "purple", label: "Vision" },
  language: { icon: MessageSquare, color: "blue", label: "Language" },
  code: { icon: Code, color: "green", label: "Code" },
  research: { icon: Search, color: "amber", label: "Research" },
  analysis: { icon: Zap, color: "pink", label: "Analysis" },
}

export function AgentOrchestrator() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [chatAgent, setChatAgent] = useState<Agent | null>(null)
  const [newAgent, setNewAgent] = useState({
    name: "",
    type: "reasoning" as AgentType,
    description: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = async () => {
    try {
      const data = await db.getAgents()
      setAgents(data)
    } catch (error) {
      console.error("[v0] Error loading agents:", error)
      setAgents([
        {
          id: "1",
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
          id: "2",
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
          id: "3",
          name: "Language Model",
          type: "language",
          status: "active",
          workload: 91.5,
          tasks_completed: 256,
          success_rate: 98.1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAgent = async () => {
    if (!newAgent.name.trim()) {
      toast({
        title: "Error",
        description: "Agent name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const agent = await db.createAgent({
        name: newAgent.name,
        type: newAgent.type,
        status: "idle",
        workload: 0,
        tasks_completed: 0,
        success_rate: 100.0,
      })

      setAgents([...agents, agent])
      setIsCreateDialogOpen(false)
      setNewAgent({ name: "", type: "reasoning", description: "" })

      toast({
        title: "Success",
        description: `Agent "${agent.name}" created successfully`,
      })
    } catch (error) {
      console.error("[v0] Error creating agent:", error)
      toast({
        title: "Error",
        description: "Failed to create agent",
        variant: "destructive",
      })
    }
  }

  const handleToggleAgent = async (id: string) => {
    const agent = agents.find((a) => a.id === id)
    if (!agent) return

    const newStatus = agent.status === "active" ? "idle" : "active"

    try {
      const updated = await db.updateAgent(id, { status: newStatus })
      setAgents(agents.map((a) => (a.id === id ? updated : a)))

      toast({
        title: "Success",
        description: `Agent ${newStatus === "active" ? "started" : "paused"}`,
      })
    } catch (error) {
      console.error("[v0] Error updating agent:", error)
      toast({
        title: "Error",
        description: "Failed to update agent status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAgent = async (id: string) => {
    try {
      await db.deleteAgent(id)
      setAgents(agents.filter((agent) => agent.id !== id))

      toast({
        title: "Success",
        description: "Agent deleted successfully",
      })
    } catch (error) {
      console.error("[v0] Error deleting agent:", error)
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/30"
      case "idle":
        return "bg-slate-500/10 text-slate-400 border-slate-500/30"
      case "paused":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading agents...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Agent Orchestrator</h2>
          <p className="text-sm text-slate-400 mt-1">Manage and coordinate your AI agents</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-slate-100">Create New Agent</DialogTitle>
              <DialogDescription className="text-slate-400">
                Configure a new AI agent with specific capabilities
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">
                  Agent Name
                </Label>
                <Input
                  id="name"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  placeholder="e.g., Data Analyzer"
                  className="bg-slate-800 border-slate-700 text-slate-100 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="type" className="text-slate-300">
                  Agent Type
                </Label>
                <Select
                  value={newAgent.type}
                  onValueChange={(value) => setNewAgent({ ...newAgent, type: value as AgentType })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {Object.entries(agentTypeConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key} className="text-slate-100">
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description" className="text-slate-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newAgent.description}
                  onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                  placeholder="Describe what this agent does..."
                  className="bg-slate-800 border-slate-700 text-slate-100 mt-1"
                  rows={3}
                />
              </div>
              <Button onClick={handleCreateAgent} className="w-full bg-cyan-600 hover:bg-cyan-700">
                Create Agent
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Total Agents</div>
                <div className="text-2xl font-bold text-cyan-400">{agents.length}</div>
              </div>
              <Bot className="h-8 w-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Active</div>
                <div className="text-2xl font-bold text-green-400">
                  {agents.filter((a) => a.status === "active").length}
                </div>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Total Tasks</div>
                <div className="text-2xl font-bold text-purple-400">
                  {agents.reduce((sum, a) => sum + a.tasks_completed, 0)}
                </div>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Avg Load</div>
                <div className="text-2xl font-bold text-blue-400">
                  {agents.length > 0 ? Math.round(agents.reduce((sum, a) => sum + a.workload, 0) / agents.length) : 0}%
                </div>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const config = agentTypeConfig[agent.type]
          const Icon = config.icon

          return (
            <Card key={agent.id} className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 bg-slate-800">
                      <AvatarFallback className={`bg-${config.color}-500/10`}>
                        <Icon className={`h-5 w-5 text-${config.color}-500`} />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base text-slate-100">{agent.name}</CardTitle>
                      <div className="text-xs text-slate-500">{agent.id.slice(0, 8)}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${getStatusColor(agent.status)} text-xs`}>
                    {agent.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Load</span>
                    <span className={`text-${config.color}-400 font-mono`}>{agent.workload.toFixed(1)}%</span>
                  </div>
                  <Progress value={agent.workload} className="h-1.5 bg-slate-800">
                    <div
                      className={`h-full bg-gradient-to-r from-${config.color}-500 to-${config.color}-400 rounded-full`}
                      style={{ width: `${agent.workload}%` }}
                    />
                  </Progress>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Tasks Completed</span>
                  <span className="text-slate-200 font-mono">{agent.tasks_completed}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Success Rate</span>
                  <span className="text-green-400 font-mono">{agent.success_rate.toFixed(1)}%</span>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-slate-700/50">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleAgent(agent.id)}
                    className="flex-1 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50"
                  >
                    {agent.status === "active" ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setChatAgent(agent)}
                    className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50"
                  >
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteAgent(agent.id)}
                    className="border-red-700/50 bg-red-900/20 hover:bg-red-900/40 text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {agents.length === 0 && (
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Bot className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No agents created yet</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-cyan-600 hover:bg-cyan-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Agent
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Agent Chat Modal */}
      {chatAgent && (
        <AgentChat
          agentId={chatAgent.id}
          agentName={chatAgent.name}
          specialization={chatAgent.type}
          onClose={() => setChatAgent(null)}
        />
      )}
    </div>
  )
}
