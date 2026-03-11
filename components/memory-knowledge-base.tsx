"use client"

import { useState } from "react"
import { Database, Search, Brain, Clock, Tag, FileText, Trash2, Plus, Filter, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MemoryEntry {
  id: string
  content: string
  type: "conversation" | "decision" | "learning" | "observation"
  agentId: string
  agentName: string
  timestamp: Date
  tags: string[]
  importance: number
  embedding?: number[]
}

interface KnowledgeItem {
  id: string
  title: string
  content: string
  category: string
  source: string
  confidence: number
  lastAccessed: Date
  accessCount: number
  tags: string[]
}

export function MemoryKnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newMemory, setNewMemory] = useState({
    content: "",
    type: "observation" as MemoryEntry["type"],
    agentId: "A001",
    tags: "",
  })

  const [memories] = useState<MemoryEntry[]>([
    {
      id: "M001",
      content: "User prefers detailed explanations with examples when learning new concepts",
      type: "learning",
      agentId: "A001",
      agentName: "Reasoning Engine",
      timestamp: new Date("2025-01-19T14:30:00"),
      tags: ["user-preference", "learning-style"],
      importance: 8,
    },
    {
      id: "M002",
      content: "Detected pattern: System performance degrades when processing more than 500 concurrent tasks",
      type: "observation",
      agentId: "A005",
      agentName: "Pattern Analyzer",
      timestamp: new Date("2025-01-19T13:15:00"),
      tags: ["performance", "system-limits"],
      importance: 9,
    },
    {
      id: "M003",
      content: "Decision made to prioritize accuracy over speed for critical financial calculations",
      type: "decision",
      agentId: "A004",
      agentName: "Decision Maker",
      timestamp: new Date("2025-01-19T12:00:00"),
      tags: ["decision", "priority", "finance"],
      importance: 10,
    },
    {
      id: "M004",
      content: "User asked about neural network optimization techniques. Provided comprehensive answer.",
      type: "conversation",
      agentId: "A003",
      agentName: "Language Model",
      timestamp: new Date("2025-01-19T11:45:00"),
      tags: ["conversation", "neural-networks", "optimization"],
      importance: 6,
    },
    {
      id: "M005",
      content: "Learned new pattern: Images with high contrast require different preprocessing",
      type: "learning",
      agentId: "A002",
      agentName: "Vision Processor",
      timestamp: new Date("2025-01-19T10:30:00"),
      tags: ["learning", "image-processing", "preprocessing"],
      importance: 7,
    },
  ])

  const [knowledge] = useState<KnowledgeItem[]>([
    {
      id: "K001",
      title: "Neural Network Optimization",
      content:
        "Best practices for optimizing neural network performance including batch normalization, learning rate scheduling, and gradient clipping.",
      category: "Machine Learning",
      source: "Training Data",
      confidence: 0.95,
      lastAccessed: new Date("2025-01-19T14:00:00"),
      accessCount: 42,
      tags: ["neural-networks", "optimization", "best-practices"],
    },
    {
      id: "K002",
      title: "DAO Governance Principles",
      content:
        "Core principles of decentralized autonomous organization governance including voting mechanisms, proposal systems, and token economics.",
      category: "Governance",
      source: "Documentation",
      confidence: 0.92,
      lastAccessed: new Date("2025-01-19T13:30:00"),
      accessCount: 28,
      tags: ["dao", "governance", "blockchain"],
    },
    {
      id: "K003",
      title: "Image Processing Techniques",
      content:
        "Advanced image processing techniques including edge detection, feature extraction, and object recognition algorithms.",
      category: "Computer Vision",
      source: "Research Papers",
      confidence: 0.88,
      lastAccessed: new Date("2025-01-19T12:15:00"),
      accessCount: 35,
      tags: ["image-processing", "computer-vision", "algorithms"],
    },
    {
      id: "K004",
      title: "System Performance Metrics",
      content:
        "Key performance indicators for AGI systems including throughput, latency, accuracy, and resource utilization.",
      category: "System Design",
      source: "Internal Analysis",
      confidence: 0.97,
      lastAccessed: new Date("2025-01-19T11:00:00"),
      accessCount: 56,
      tags: ["performance", "metrics", "monitoring"],
    },
  ])

  const filteredMemories = memories.filter((memory) => {
    const matchesSearch =
      memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = selectedType === "all" || memory.type === selectedType
    return matchesSearch && matchesType
  })

  const filteredKnowledge = knowledge.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getTypeColor = (type: MemoryEntry["type"]) => {
    switch (type) {
      case "conversation":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30"
      case "decision":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30"
      case "learning":
        return "bg-green-500/10 text-green-400 border-green-500/30"
      case "observation":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
    }
  }

  const getImportanceColor = (importance: number) => {
    if (importance >= 9) return "text-red-400"
    if (importance >= 7) return "text-amber-400"
    return "text-slate-400"
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) return `${hours}h ago`
    return `${minutes}m ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Memory & Knowledge Base</h2>
          <p className="text-sm text-slate-400 mt-1">Long-term memory and knowledge management for AGI agents</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Memory
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-slate-100">Add New Memory</DialogTitle>
              <DialogDescription className="text-slate-400">
                Store a new memory entry for agent learning
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="content" className="text-slate-300">
                  Memory Content
                </Label>
                <Textarea
                  id="content"
                  value={newMemory.content}
                  onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
                  placeholder="Describe what should be remembered..."
                  className="bg-slate-800 border-slate-700 text-slate-100 mt-1"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="type" className="text-slate-300">
                  Memory Type
                </Label>
                <Select
                  value={newMemory.type}
                  onValueChange={(value) => setNewMemory({ ...newMemory, type: value as MemoryEntry["type"] })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="conversation" className="text-slate-100">
                      Conversation
                    </SelectItem>
                    <SelectItem value="decision" className="text-slate-100">
                      Decision
                    </SelectItem>
                    <SelectItem value="learning" className="text-slate-100">
                      Learning
                    </SelectItem>
                    <SelectItem value="observation" className="text-slate-100">
                      Observation
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tags" className="text-slate-300">
                  Tags (comma-separated)
                </Label>
                <Input
                  id="tags"
                  value={newMemory.tags}
                  onChange={(e) => setNewMemory({ ...newMemory, tags: e.target.value })}
                  placeholder="e.g., user-preference, performance"
                  className="bg-slate-800 border-slate-700 text-slate-100 mt-1"
                />
              </div>
              <Button onClick={() => setIsAddDialogOpen(false)} className="w-full bg-cyan-600 hover:bg-cyan-700">
                Add Memory
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
                <div className="text-sm text-slate-400">Total Memories</div>
                <div className="text-2xl font-bold text-cyan-400">{memories.length}</div>
              </div>
              <Database className="h-8 w-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Knowledge Items</div>
                <div className="text-2xl font-bold text-purple-400">{knowledge.length}</div>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Avg Confidence</div>
                <div className="text-2xl font-bold text-blue-400">
                  {Math.round((knowledge.reduce((sum, k) => sum + k.confidence, 0) / knowledge.length) * 100)}%
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Total Accesses</div>
                <div className="text-2xl font-bold text-green-400">
                  {knowledge.reduce((sum, k) => sum + k.accessCount, 0)}
                </div>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search memories and knowledge..."
                className="pl-10 bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700 text-slate-100">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-slate-100">
                  All Types
                </SelectItem>
                <SelectItem value="conversation" className="text-slate-100">
                  Conversations
                </SelectItem>
                <SelectItem value="decision" className="text-slate-100">
                  Decisions
                </SelectItem>
                <SelectItem value="learning" className="text-slate-100">
                  Learning
                </SelectItem>
                <SelectItem value="observation" className="text-slate-100">
                  Observations
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="memories" className="w-full">
        <TabsList className="bg-slate-800/50 p-1">
          <TabsTrigger value="memories" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
            <Database className="h-4 w-4 mr-2" />
            Memories ({filteredMemories.length})
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
            <Brain className="h-4 w-4 mr-2" />
            Knowledge Base ({filteredKnowledge.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="memories" className="mt-6">
          <div className="space-y-4">
            {filteredMemories.map((memory) => (
              <Card key={memory.id} className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={`${getTypeColor(memory.type)} text-xs`}>
                        {memory.type}
                      </Badge>
                      <span className="text-xs text-slate-500">{memory.agentName}</span>
                      <span className="text-xs text-slate-600">•</span>
                      <span className="text-xs text-slate-500">{formatTimeAgo(memory.timestamp)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`text-xs font-mono ${getImportanceColor(memory.importance)}`}>
                        Priority: {memory.importance}/10
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-slate-300 mb-3">{memory.content}</p>

                  <div className="flex flex-wrap gap-2">
                    {memory.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-slate-800/50 text-slate-400 border-slate-700 text-xs"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredKnowledge.map((item) => (
              <Card key={item.id} className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base text-slate-100 mb-1">{item.title}</CardTitle>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{item.source}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
                      {Math.round(item.confidence * 100)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-400">{item.content}</p>

                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-slate-800/50 text-slate-400 border-slate-700 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-xs text-slate-500">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimeAgo(item.lastAccessed)}
                    </div>
                    <div>{item.accessCount} accesses</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
