"use client"

import { TooltipContent } from "@/components/ui/tooltip"

import { useEffect, useState, useRef } from "react"
import {
  AlertCircle,
  BarChart3,
  Bell,
  Bot,
  Brain,
  Command,
  Cpu,
  Database,
  Download,
  LineChart,
  type LucideIcon,
  MessageSquare,
  Mic,
  Moon,
  Network,
  Package,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sun,
  Terminal,
  Users,
  Vote,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AgentOrchestrator } from "@/components/agent-orchestrator"
import { InteractiveTerminal } from "@/components/interactive-terminal"
import { MemoryKnowledgeBase } from "@/components/memory-knowledge-base"
import { ToolMarketplace } from "@/components/tool-marketplace"
import { DaoGovernance } from "@/components/dao-governance" // Added DaoGovernance import
import { AdvancedAnalytics } from "@/components/advanced-analytics" // Added AdvancedAnalytics import
import { APIManager } from "@/components/api-manager" // Added APIManager import

export default function Dashboard() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [systemStatus, setSystemStatus] = useState(92)
  const [aiProcessing, setAiProcessing] = useState(78)
  const [neuralActivity, setNeuralActivity] = useState(85)
  const [networkStatus, setNetworkStatus] = useState(94)
  const [governanceScore, setGovernanceScore] = useState(88)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [activeView, setActiveView] = useState<
    "dashboard" | "agents" | "terminal" | "memory" | "tools" | "governance" | "analytics" | "apis"
  >("dashboard") // Added "analytics" and "apis" to the union type

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Simulate changing data
  useEffect(() => {
    const interval = setInterval(() => {
      setAiProcessing(Math.floor(Math.random() * 20) + 70)
      setNeuralActivity(Math.floor(Math.random() * 15) + 80)
      setNetworkStatus(Math.floor(Math.random() * 10) + 90)
      setSystemStatus(Math.floor(Math.random() * 8) + 90)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Particle effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: Particle[] = []
    const particleCount = 100

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${Math.floor(Math.random() * 55) + 200}, ${Math.random() * 0.5 + 0.2})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div
      className={`${theme} min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden`}
    >
      {/* Background particle effect */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-r-purple-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
              <div className="absolute inset-6 border-4 border-b-blue-500 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
              <div className="absolute inset-8 border-4 border-l-green-500 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-4 text-cyan-500 font-mono text-sm tracking-wider">AGI SYSTEM INITIALIZING</div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-cyan-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              AGI OS-DAO
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-1 bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-700/50 backdrop-blur-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search agents..."
                className="bg-transparent border-none focus:outline-none text-sm w-40 placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-100">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="text-slate-400 hover:text-slate-100"
                    >
                      {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback className="bg-slate-700 text-cyan-500">AI</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <NavItem
                    icon={Command}
                    label="Dashboard"
                    active={activeView === "dashboard"}
                    onClick={() => setActiveView("dashboard")}
                  />
                  <NavItem
                    icon={Bot}
                    label="AI Agents"
                    active={activeView === "agents"}
                    onClick={() => setActiveView("agents")}
                  />
                  <NavItem
                    icon={Terminal}
                    label="Terminal"
                    active={activeView === "terminal"}
                    onClick={() => setActiveView("terminal")}
                  />
                  <NavItem
                    icon={Database}
                    label="Memory"
                    active={activeView === "memory"}
                    onClick={() => setActiveView("memory")}
                  />
                  <NavItem
                    icon={Package}
                    label="Tools"
                    active={activeView === "tools"}
                    onClick={() => setActiveView("tools")}
                  />
                  <NavItem
                    icon={Vote}
                    label="Governance"
                    active={activeView === "governance"}
                    onClick={() => setActiveView("governance")}
                  />
                  <NavItem
                    icon={BarChart3}
                    label="Analytics"
                    active={activeView === "analytics"}
                    onClick={() => setActiveView("analytics")}
                  />
                  <NavItem
                    icon={Zap}
                    label="API Manager"
                    active={activeView === "apis"}
                    onClick={() => setActiveView("apis")}
                  />
                  <NavItem icon={Brain} label="Neural Network" />
                  <NavItem icon={Network} label="Network" />
                  <NavItem icon={Users} label="Community" />
                  <NavItem icon={Settings} label="Settings" />
                </nav>

                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-2 font-mono">SYSTEM STATUS</div>
                  <div className="space-y-3">
                    <StatusItem label="AGI Systems" value={systemStatus} color="cyan" />
                    <StatusItem label="Governance" value={governanceScore} color="purple" />
                    <StatusItem label="Network" value={networkStatus} color="blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {activeView === "apis" ? (
            <div className="col-span-12 md:col-span-9 lg:col-span-10">
              <APIManager />
            </div>
          ) : activeView === "analytics" ? (
            <div className="col-span-12 md:col-span-9 lg:col-span-10">
              <AdvancedAnalytics />
            </div>
          ) : activeView === "governance" ? (
            <div className="col-span-12 md:col-span-9 lg:col-span-10">
              <DaoGovernance />
            </div>
          ) : activeView === "tools" ? (
            <div className="col-span-12 md:col-span-9 lg:col-span-10">
              <ToolMarketplace />
            </div>
          ) : activeView === "memory" ? (
            <div className="col-span-12 md:col-span-9 lg:col-span-10">
              <MemoryKnowledgeBase />
            </div>
          ) : activeView === "terminal" ? (
            <div className="col-span-12 md:col-span-9 lg:col-span-10">
              <InteractiveTerminal />
            </div>
          ) : activeView === "agents" ? (
            <div className="col-span-12 md:col-span-9 lg:col-span-10">
              <AgentOrchestrator />
            </div>
          ) : activeView === "dashboard" ? (
            <>
              <div className="col-span-12 md:col-span-9 lg:col-span-7">
                {/* AGI Overview */}
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="border-b border-slate-700/50 pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-slate-100 flex items-center">
                        <Brain className="mr-2 h-5 w-5 text-cyan-500" />
                        AGI System Overview
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-slate-800/50 text-cyan-400 border-cyan-500/50 text-xs">
                          <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></div>
                          ACTIVE
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <MetricCard
                        title="AI Processing"
                        value={aiProcessing}
                        icon={Cpu}
                        trend="up"
                        color="cyan"
                        detail="24 Agents Active"
                      />
                      <MetricCard
                        title="Neural Activity"
                        value={neuralActivity}
                        icon={Brain}
                        trend="stable"
                        color="purple"
                        detail="1.2M Neurons"
                      />
                      <MetricCard
                        title="Network Sync"
                        value={networkStatus}
                        icon={Network}
                        trend="up"
                        color="blue"
                        detail="842 Nodes"
                      />
                    </div>

                    <div className="mt-8">
                      <Tabs defaultValue="agents" className="w-full">
                        <div className="flex items-center justify-between mb-4">
                          <TabsList className="bg-slate-800/50 p-1">
                            <TabsTrigger
                              value="agents"
                              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                            >
                              AI Agents
                            </TabsTrigger>
                            <TabsTrigger
                              value="neural"
                              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                            >
                              Neural Network
                            </TabsTrigger>
                            <TabsTrigger
                              value="performance"
                              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                            >
                              Performance
                            </TabsTrigger>
                          </TabsList>

                          <div className="flex items-center space-x-2 text-xs text-slate-400">
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-cyan-500 mr-1"></div>
                              Processing
                            </div>
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-purple-500 mr-1"></div>
                              Learning
                            </div>
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                              Inference
                            </div>
                          </div>
                        </div>

                        <TabsContent value="agents" className="mt-0">
                          <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                            <div className="grid grid-cols-12 text-xs text-slate-400 p-3 border-b border-slate-700/50 bg-slate-800/50">
                              <div className="col-span-1">ID</div>
                              <div className="col-span-4">Agent Name</div>
                              <div className="col-span-2">Type</div>
                              <div className="col-span-2">Load</div>
                              <div className="col-span-2">Tasks</div>
                              <div className="col-span-1">Status</div>
                            </div>

                            <div className="divide-y divide-slate-700/30">
                              <AgentRow
                                id="A001"
                                name="Reasoning Engine"
                                type="Logic"
                                load={87.4}
                                tasks={142}
                                status="active"
                              />
                              <AgentRow
                                id="A002"
                                name="Vision Processor"
                                type="Vision"
                                load={72.1}
                                tasks={89}
                                status="active"
                              />
                              <AgentRow
                                id="A003"
                                name="Language Model"
                                type="NLP"
                                load={91.5}
                                tasks={256}
                                status="active"
                              />
                              <AgentRow
                                id="A004"
                                name="Decision Maker"
                                type="Logic"
                                load={65.8}
                                tasks={73}
                                status="active"
                              />
                              <AgentRow
                                id="A005"
                                name="Pattern Analyzer"
                                type="Analysis"
                                load={78.3}
                                tasks={124}
                                status="active"
                              />
                              <AgentRow
                                id="A006"
                                name="Memory Manager"
                                type="Storage"
                                load={54.2}
                                tasks={98}
                                status="active"
                              />
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="neural" className="mt-0">
                          <div className="h-64 w-full relative bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                            <NeuralNetworkViz />
                            <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-md px-3 py-2 border border-slate-700/50">
                              <div className="text-xs text-slate-400">Neural Activity</div>
                              <div className="text-lg font-mono text-purple-400">{neuralActivity}%</div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="performance" className="mt-0">
                          <div className="h-64 w-full relative bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                            <PerformanceChart />
                            <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-md px-3 py-2 border border-slate-700/50">
                              <div className="text-xs text-slate-400">System Load</div>
                              <div className="text-lg font-mono text-cyan-400">{aiProcessing}%</div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>

                {/* DAO Governance & Alerts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-slate-100 flex items-center text-base">
                        <Vote className="mr-2 h-5 w-5 text-purple-500" />
                        DAO Governance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <ProposalItem
                          title="Upgrade Neural Network v3.2"
                          votes={{ for: 842, against: 156 }}
                          status="active"
                          timeLeft="2d 14h"
                        />
                        <ProposalItem
                          title="Add New AI Agent Type"
                          votes={{ for: 654, against: 234 }}
                          status="active"
                          timeLeft="5d 8h"
                        />
                        <ProposalItem
                          title="Increase Token Rewards"
                          votes={{ for: 1024, against: 89 }}
                          status="passed"
                          timeLeft="Ended"
                        />

                        <div className="pt-2 mt-2 border-t border-slate-700/50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium">Governance Score</div>
                            <div className="text-sm text-purple-400">{governanceScore}%</div>
                          </div>
                          <Progress value={governanceScore} className="h-2 bg-slate-700">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                              style={{ width: `${governanceScore}%` }}
                            />
                          </Progress>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-slate-100 flex items-center text-base">
                        <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                        System Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <AlertItem
                          title="Agent Training Complete"
                          time="14:32:12"
                          description="Vision Processor v2.1 training completed successfully"
                          type="success"
                        />
                        <AlertItem
                          title="High Neural Activity"
                          time="13:45:06"
                          description="Unusual spike in layer 7 processing detected"
                          type="warning"
                        />
                        <AlertItem
                          title="New Proposal Created"
                          time="12:18:45"
                          description="Community member submitted governance proposal #42"
                          type="info"
                        />
                        <AlertItem
                          title="Network Sync Complete"
                          time="09:30:00"
                          description="All 842 nodes synchronized successfully"
                          type="success"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Agent Communications */}
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-slate-100 flex items-center text-base">
                      <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                      Agent Communications
                    </CardTitle>
                    <Badge variant="outline" className="bg-slate-800/50 text-blue-400 border-blue-500/50">
                      6 New Messages
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <CommunicationItem
                        sender="Reasoning Engine"
                        time="15:42:12"
                        message="Completed analysis of dataset #4521. Confidence level: 94.2%. Ready for review."
                        avatar="/ai-brain.png"
                        unread
                      />
                      <CommunicationItem
                        sender="Vision Processor"
                        time="14:30:45"
                        message="Detected anomaly in image batch 892. Flagged for manual inspection."
                        avatar="/ai-eye.jpg"
                        unread
                      />
                      <CommunicationItem
                        sender="Language Model"
                        time="13:15:33"
                        message="Generated 1,245 responses. Average quality score: 8.7/10."
                        avatar="/ai-text.jpg"
                        unread
                      />
                      <CommunicationItem
                        sender="Decision Maker"
                        time="11:05:18"
                        message="Optimization complete. System efficiency improved by 12.4%."
                        avatar="/ai-logic.jpg"
                        unread
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-slate-700/50 pt-4">
                    <div className="flex items-center w-full space-x-2">
                      <input
                        type="text"
                        placeholder="Send command to agents..."
                        className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                      <Button size="icon" className="bg-blue-600 hover:bg-blue-700">
                        <Mic className="h-4 w-4" />
                      </Button>
                      <Button size="icon" className="bg-cyan-600 hover:bg-cyan-700">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              <div className="col-span-12 lg:col-span-3">
                <div className="grid gap-6">
                  {/* System time */}
                  <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-700/50">
                        <div className="text-center">
                          <div className="text-xs text-slate-500 mb-1 font-mono">SYSTEM TIME</div>
                          <div className="text-3xl font-mono text-cyan-400 mb-1">{formatTime(currentTime)}</div>
                          <div className="text-sm text-slate-400">{formatDate(currentTime)}</div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                            <div className="text-xs text-slate-500 mb-1">Uptime</div>
                            <div className="text-sm font-mono text-slate-200">42d 18:24:36</div>
                          </div>
                          <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                            <div className="text-xs text-slate-500 mb-1">Agents</div>
                            <div className="text-sm font-mono text-slate-200">24 Active</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick actions */}
                  <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-slate-100 text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        <ActionButton icon={Bot} label="New Agent" />
                        <ActionButton icon={Brain} label="Train Model" />
                        <ActionButton icon={Vote} label="Create Proposal" />
                        <ActionButton icon={Terminal} label="Console" onClick={() => setActiveView("terminal")} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Token Stats */}
                  <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-slate-100 text-base">DAO Token Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                          <div className="text-xs text-slate-500 mb-1">Total Supply</div>
                          <div className="text-lg font-mono text-cyan-400">1,000,000 AGI</div>
                        </div>

                        <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                          <div className="text-xs text-slate-500 mb-1">Circulating</div>
                          <div className="text-lg font-mono text-purple-400">742,500 AGI</div>
                        </div>

                        <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                          <div className="text-xs text-slate-500 mb-1">Your Balance</div>
                          <div className="text-lg font-mono text-blue-400">12,450 AGI</div>
                        </div>

                        <div className="pt-2 border-t border-slate-700/50">
                          <div className="flex items-center justify-between text-sm">
                            <div className="text-slate-400">Voting Power</div>
                            <div className="text-cyan-400">1.24%</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Environment controls */}
                  <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-slate-100 text-base">System Controls</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Bot className="text-cyan-500 mr-2 h-4 w-4" />
                            <Label className="text-sm text-slate-400">Auto-Learning</Label>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Shield className="text-cyan-500 mr-2 h-4 w-4" />
                            <Label className="text-sm text-slate-400">Security Protocol</Label>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Network className="text-cyan-500 mr-2 h-4 w-4" />
                            <Label className="text-sm text-slate-400">Network Sync</Label>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Zap className="text-cyan-500 mr-2 h-4 w-4" />
                            <Label className="text-sm text-slate-400">Power Saving</Label>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-12 md:col-span-9 lg:col-span-10">
              <AgentOrchestrator />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Component for nav items
function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`w-full justify-start ${active ? "bg-slate-800/70 text-cyan-400" : "text-slate-400 hover:text-slate-100"}`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}

// Component for status items
function StatusItem({ label, value, color }: { label: string; value: number; color: string }) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "from-cyan-500 to-blue-500"
      case "green":
        return "from-green-500 to-emerald-500"
      case "blue":
        return "from-blue-500 to-indigo-500"
      case "purple":
        return "from-purple-500 to-pink-500"
      default:
        return "from-cyan-500 to-blue-500"
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-xs text-slate-400">{value}%</div>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${getColor()} rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}

// Component for metric cards
function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  detail,
}: {
  title: string
  value: number
  icon: LucideIcon
  trend: "up" | "down" | "stable"
  color: string
  detail: string
}) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "from-cyan-500 to-blue-500 border-cyan-500/30"
      case "green":
        return "from-green-500 to-emerald-500 border-green-500/30"
      case "blue":
        return "from-blue-500 to-indigo-500 border-blue-500/30"
      case "purple":
        return "from-purple-500 to-pink-500 border-purple-500/30"
      default:
        return "from-cyan-500 to-blue-500 border-cyan-500/30"
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <BarChart3 className="h-4 w-4 text-green-500" />
      case "down":
        return <BarChart3 className="h-4 w-4 rotate-180 text-amber-500" />
      case "stable":
        return <LineChart className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className={`bg-slate-800/50 rounded-lg border ${getColor()} p-4 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-400">{title}</div>
        <Icon className={`h-5 w-5 text-${color}-500`} />
      </div>
      <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-slate-100 to-slate-300">
        {value}%
      </div>
      <div className="text-xs text-slate-500">{detail}</div>
      <div className="absolute bottom-2 right-2 flex items-center">{getTrendIcon()}</div>
      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-cyan-500 to-blue-500"></div>
    </div>
  )
}

function AgentRow({
  id,
  name,
  type,
  load,
  tasks,
  status,
}: {
  id: string
  name: string
  type: string
  load: number
  tasks: number
  status: string
}) {
  return (
    <div className="grid grid-cols-12 py-2 px-3 text-sm hover:bg-slate-800/50">
      <div className="col-span-1 text-slate-500">{id}</div>
      <div className="col-span-4 text-slate-300">{name}</div>
      <div className="col-span-2 text-slate-400">{type}</div>
      <div className="col-span-2 text-cyan-400">{load}%</div>
      <div className="col-span-2 text-purple-400">{tasks}</div>
      <div className="col-span-1">
        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
          {status}
        </Badge>
      </div>
    </div>
  )
}

function ProposalItem({
  title,
  votes,
  status,
  timeLeft,
}: {
  title: string
  votes: { for: number; against: number }
  status: "active" | "passed" | "rejected"
  timeLeft: string
}) {
  const total = votes.for + votes.against
  const forPercentage = (votes.for / total) * 100

  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30"
      case "passed":
        return "bg-green-500/10 text-green-400 border-green-500/30"
      case "rejected":
        return "bg-red-500/10 text-red-400 border-red-500/30"
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/30"
    }
  }

  return (
    <div className="bg-slate-800/30 rounded-md p-3 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-300">{title}</div>
        <Badge variant="outline" className={`${getStatusColor()} text-xs`}>
          {status}
        </Badge>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1 text-xs">
          <div className="text-green-400">For: {votes.for}</div>
          <div className="text-red-400">Against: {votes.against}</div>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
            style={{ width: `${forPercentage}%` }}
          />
        </div>
      </div>
      <div className="text-xs text-slate-500">{timeLeft}</div>
    </div>
  )
}

function NeuralNetworkViz() {
  return (
    <div className="h-full w-full flex items-center justify-center relative">
      {/* Neural network nodes */}
      <div className="absolute inset-0 flex items-center justify-around px-8">
        {/* Input layer */}
        <div className="flex flex-col justify-around h-full py-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`input-${i}`}
              className="h-3 w-3 rounded-full bg-cyan-500 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        {/* Hidden layer 1 */}
        <div className="flex flex-col justify-around h-full py-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`hidden1-${i}`}
              className="h-2.5 w-2.5 rounded-full bg-purple-500 animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>

        {/* Hidden layer 2 */}
        <div className="flex flex-col justify-around h-full py-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`hidden2-${i}`}
              className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>

        {/* Output layer */}
        <div className="flex flex-col justify-around h-full py-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`output-${i}`}
              className="h-3 w-3 rounded-full bg-green-500 animate-pulse"
              style={{ animationDelay: `${i * 0.25}s` }}
            />
          ))}
        </div>
      </div>

      {/* Connection lines effect */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        {Array.from({ length: 20 }).map((_, i) => (
          <line
            key={i}
            x1={`${Math.random() * 30}%`}
            y1={`${Math.random() * 100}%`}
            x2={`${Math.random() * 30 + 70}%`}
            y2={`${Math.random() * 100}%`}
            stroke="url(#lineGradient)"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}
      </svg>
    </div>
  )
}

// Performance chart component
function PerformanceChart() {
  return (
    <div className="h-full w-full flex items-end justify-between px-4 pt-4 pb-8 relative">
      {/* Y-axis labels */}
      <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-4">
        <div className="text-xs text-slate-500">100%</div>
        <div className="text-xs text-slate-500">75%</div>
        <div className="text-xs text-slate-500">50%</div>
        <div className="text-xs text-slate-500">25%</div>
        <div className="text-xs text-slate-500">0%</div>
      </div>

      {/* X-axis grid lines */}
      <div className="absolute left-0 right-0 top-0 h-full flex flex-col justify-between py-4 px-10">
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
      </div>

      {/* Chart bars */}
      <div className="flex-1 h-full flex items-end justify-between px-2 z-10">
        {Array.from({ length: 24 }).map((_, i) => {
          const processingHeight = Math.floor(Math.random() * 50) + 30
          const learningHeight = Math.floor(Math.random() * 40) + 40
          const inferenceHeight = Math.floor(Math.random() * 35) + 25

          return (
            <div key={i} className="flex space-x-0.5">
              <div
                className="w-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-sm"
                style={{ height: `${processingHeight}%` }}
              ></div>
              <div
                className="w-1 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-sm"
                style={{ height: `${learningHeight}%` }}
              ></div>
              <div
                className="w-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm"
                style={{ height: `${inferenceHeight}%` }}
              ></div>
            </div>
          )
        })}
      </div>

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-10">
        <div className="text-xs text-slate-500">00:00</div>
        <div className="text-xs text-slate-500">06:00</div>
        <div className="text-xs text-slate-500">12:00</div>
        <div className="text-xs text-slate-500">18:00</div>
        <div className="text-xs text-slate-500">24:00</div>
      </div>
    </div>
  )
}

// Alert item component
function AlertItem({
  title,
  time,
  description,
  type,
}: {
  title: string
  time: string
  description: string
  type: "info" | "warning" | "error" | "success" | "update"
}) {
  const getTypeStyles = () => {
    switch (type) {
      case "info":
        return { icon: AlertCircle, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" }
      case "warning":
        return { icon: AlertCircle, color: "text-amber-500 bg-amber-500/10 border-amber-500/30" }
      case "error":
        return { icon: AlertCircle, color: "text-red-500 bg-red-500/10 border-red-500/30" }
      case "success":
        return { icon: Shield, color: "text-green-500 bg-green-500/10 border-green-500/30" }
      case "update":
        return { icon: Download, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30" }
      default:
        return { icon: AlertCircle, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" }
    }
  }

  const { icon: Icon, color } = getTypeStyles()

  return (
    <div className="flex items-start space-x-3">
      <div className={`mt-0.5 p-1 rounded-full ${color.split(" ")[1]} ${color.split(" ")[2]}`}>
        <Icon className={`h-3 w-3 ${color.split(" ")[0]}`} />
      </div>
      <div>
        <div className="flex items-center">
          <div className="text-sm font-medium text-slate-200">{title}</div>
          <div className="ml-2 text-xs text-slate-500">{time}</div>
        </div>
        <div className="text-xs text-slate-400">{description}</div>
      </div>
    </div>
  )
}

// Communication item component
function CommunicationItem({
  sender,
  time,
  message,
  avatar,
  unread,
}: {
  sender: string
  time: string
  message: string
  avatar: string
  unread?: boolean
}) {
  return (
    <div className={`flex space-x-3 p-2 rounded-md ${unread ? "bg-slate-800/50 border border-slate-700/50" : ""}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar || "/placeholder.svg"} alt={sender} />
        <AvatarFallback className="bg-slate-700 text-cyan-500">{sender.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-200">{sender}</div>
          <div className="text-xs text-slate-500">{time}</div>
        </div>
        <div className="text-xs text-slate-400 mt-1">{message}</div>
      </div>
      {unread && (
        <div className="flex-shrink-0 self-center">
          <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
        </div>
      )}
    </div>
  )
}

// Action button component
function ActionButton({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick?: () => void }) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="h-auto py-3 px-3 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 flex flex-col items-center justify-center space-y-1 w-full"
    >
      <Icon className="h-5 w-5 text-cyan-500" />
      <span className="text-xs">{label}</span>
    </Button>
  )
}

// Add missing imports
function Info(props: any) {
  return <AlertCircle {...props} />
}

function Check(props: any) {
  return <Shield {...props} />
}
