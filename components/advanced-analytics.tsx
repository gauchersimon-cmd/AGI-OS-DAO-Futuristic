"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Clock,
  DollarSign,
  Users,
  Brain,
  Cpu,
  Database,
  Download,
  Calendar,
} from "lucide-react"

export function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">("7d")

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-100 flex items-center text-xl">
                <BarChart3 className="mr-2 h-6 w-6 text-cyan-500" />
                Advanced Analytics
              </CardTitle>
              <CardDescription className="text-slate-400 mt-1">
                Comprehensive insights into system performance and usage
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant={timeRange === "24h" ? "default" : "outline"}
                onClick={() => setTimeRange("24h")}
                className={timeRange === "24h" ? "bg-cyan-600" : ""}
              >
                24h
              </Button>
              <Button
                size="sm"
                variant={timeRange === "7d" ? "default" : "outline"}
                onClick={() => setTimeRange("7d")}
                className={timeRange === "7d" ? "bg-cyan-600" : ""}
              >
                7d
              </Button>
              <Button
                size="sm"
                variant={timeRange === "30d" ? "default" : "outline"}
                onClick={() => setTimeRange("30d")}
                className={timeRange === "30d" ? "bg-cyan-600" : ""}
              >
                30d
              </Button>
              <Button
                size="sm"
                variant={timeRange === "90d" ? "default" : "outline"}
                onClick={() => setTimeRange("90d")}
                className={timeRange === "90d" ? "bg-cyan-600" : ""}
              >
                90d
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Requests" value="2.4M" change={12.5} trend="up" icon={Activity} color="cyan" />
        <MetricCard title="Avg Response Time" value="142ms" change={-8.3} trend="down" icon={Clock} color="purple" />
        <MetricCard title="Token Usage" value="18.7M" change={15.2} trend="up" icon={Zap} color="blue" />
        <MetricCard title="Active Users" value="12.4K" change={23.1} trend="up" icon={Users} color="green" />
      </div>

      {/* Charts */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="bg-slate-800/50">
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
          >
            Performance
          </TabsTrigger>
          <TabsTrigger value="usage" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
            Usage
          </TabsTrigger>
          <TabsTrigger value="agents" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
            Agents
          </TabsTrigger>
          <TabsTrigger value="costs" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
            Costs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-100 text-base">Response Time Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full relative">
                  <ResponseTimeChart />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-100 text-base">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full relative">
                  <SuccessRateChart />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-100 text-base">System Load Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full relative">
                <LoadDistributionChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-100 text-base">Request Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full relative">
                  <RequestVolumeChart />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-100 text-base">Token Consumption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full relative">
                  <TokenConsumptionChart />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-100 text-base">Top Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <EndpointRow endpoint="/api/agents/reasoning" requests={456789} percentage={32.4} />
                <EndpointRow endpoint="/api/agents/vision" requests={342156} percentage={24.3} />
                <EndpointRow endpoint="/api/agents/language" requests={289034} percentage={20.5} />
                <EndpointRow endpoint="/api/governance/vote" requests={178923} percentage={12.7} />
                <EndpointRow endpoint="/api/tools/search" requests={142567} percentage={10.1} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400">Total Agents</div>
                    <div className="text-2xl font-bold text-cyan-400">24</div>
                    <div className="text-xs text-slate-500">6 types</div>
                  </div>
                  <Brain className="h-8 w-8 text-cyan-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400">Avg CPU Usage</div>
                    <div className="text-2xl font-bold text-purple-400">67.8%</div>
                    <div className="text-xs text-slate-500">Per agent</div>
                  </div>
                  <Cpu className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400">Memory Usage</div>
                    <div className="text-2xl font-bold text-blue-400">4.2GB</div>
                    <div className="text-xs text-slate-500">Total allocated</div>
                  </div>
                  <Database className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-100 text-base">Agent Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AgentPerformanceRow
                  name="Reasoning Engine"
                  type="Logic"
                  requests={142567}
                  avgTime={98}
                  successRate={98.7}
                />
                <AgentPerformanceRow
                  name="Vision Processor"
                  type="Vision"
                  requests={89234}
                  avgTime={156}
                  successRate={97.2}
                />
                <AgentPerformanceRow
                  name="Language Model"
                  type="NLP"
                  requests={256789}
                  avgTime={124}
                  successRate={99.1}
                />
                <AgentPerformanceRow
                  name="Decision Maker"
                  type="Logic"
                  requests={73456}
                  avgTime={87}
                  successRate={98.9}
                />
                <AgentPerformanceRow
                  name="Pattern Analyzer"
                  type="Analysis"
                  requests={124890}
                  avgTime={142}
                  successRate={96.8}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400">Total Cost</div>
                    <div className="text-2xl font-bold text-green-400">$2,847</div>
                    <div className="text-xs text-green-500 flex items-center">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -12.3% vs last period
                    </div>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400">Cost per Request</div>
                    <div className="text-2xl font-bold text-cyan-400">$0.0012</div>
                    <div className="text-xs text-green-500 flex items-center">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -8.7% optimized
                    </div>
                  </div>
                  <Activity className="h-8 w-8 text-cyan-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400">Projected Monthly</div>
                    <div className="text-2xl font-bold text-purple-400">$12.2K</div>
                    <div className="text-xs text-slate-500">Based on current usage</div>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-100 text-base">Cost Breakdown by Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <CostBreakdownRow service="AI Model Inference" cost={1847} percentage={64.9} />
                <CostBreakdownRow service="Database Operations" cost={456} percentage={16.0} />
                <CostBreakdownRow service="Network Transfer" cost={312} percentage={11.0} />
                <CostBreakdownRow service="Storage" cost={156} percentage={5.5} />
                <CostBreakdownRow service="Other Services" cost={76} percentage={2.6} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-100 text-base">Cost Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full relative">
                <CostTrendChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}: {
  title: string
  value: string
  change: number
  trend: "up" | "down"
  icon: any
  color: string
}) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "text-cyan-500"
      case "purple":
        return "text-purple-500"
      case "blue":
        return "text-blue-500"
      case "green":
        return "text-green-500"
      default:
        return "text-cyan-500"
    }
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-slate-400">{title}</div>
          <Icon className={`h-5 w-5 ${getColor()}`} />
        </div>
        <div className="text-2xl font-bold text-slate-100 mb-1">{value}</div>
        <div
          className={`text-xs flex items-center ${trend === "up" ? (change > 0 ? "text-green-500" : "text-red-500") : change < 0 ? "text-green-500" : "text-red-500"}`}
        >
          {trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {Math.abs(change)}% vs last period
        </div>
      </CardContent>
    </Card>
  )
}

function ResponseTimeChart() {
  return (
    <div className="h-full w-full flex items-end justify-between px-2 relative">
      {Array.from({ length: 30 }).map((_, i) => {
        const height = Math.floor(Math.random() * 60) + 20
        return (
          <div
            key={i}
            className="w-2 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-sm hover:from-cyan-400 hover:to-cyan-300 transition-all cursor-pointer"
            style={{ height: `${height}%` }}
          />
        )
      })}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-slate-500 -mb-6">
        <span>Day 1</span>
        <span>Day 15</span>
        <span>Day 30</span>
      </div>
    </div>
  )
}

function SuccessRateChart() {
  return (
    <div className="h-full w-full flex items-center justify-center relative">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="currentColor"
            strokeWidth="16"
            fill="none"
            className="text-slate-800"
          />
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="currentColor"
            strokeWidth="16"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 80 * 0.987} ${2 * Math.PI * 80}`}
            className="text-green-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-green-400">98.7%</div>
          <div className="text-sm text-slate-400">Success Rate</div>
        </div>
      </div>
    </div>
  )
}

function LoadDistributionChart() {
  return (
    <div className="h-full w-full flex items-end justify-between px-4 relative">
      {[
        { label: "CPU", value: 67, color: "from-cyan-500 to-cyan-400" },
        { label: "Memory", value: 54, color: "from-purple-500 to-purple-400" },
        { label: "Network", value: 42, color: "from-blue-500 to-blue-400" },
        { label: "Storage", value: 38, color: "from-green-500 to-green-400" },
        { label: "GPU", value: 72, color: "from-amber-500 to-amber-400" },
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center flex-1">
          <div
            className={`w-16 bg-gradient-to-t ${item.color} rounded-t-md mb-2`}
            style={{ height: `${item.value}%` }}
          />
          <div className="text-xs text-slate-400">{item.label}</div>
          <div className="text-xs text-slate-500">{item.value}%</div>
        </div>
      ))}
    </div>
  )
}

function RequestVolumeChart() {
  return (
    <div className="h-full w-full flex items-end justify-between px-2 relative">
      {Array.from({ length: 24 }).map((_, i) => {
        const height = Math.floor(Math.random() * 70) + 15
        return (
          <div key={i} className="flex flex-col items-center">
            <div
              className="w-3 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-sm"
              style={{ height: `${height}%` }}
            />
          </div>
        )
      })}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-slate-500 -mb-6">
        <span>00:00</span>
        <span>12:00</span>
        <span>24:00</span>
      </div>
    </div>
  )
}

function TokenConsumptionChart() {
  return (
    <div className="h-full w-full flex items-end justify-between px-2 relative">
      {Array.from({ length: 30 }).map((_, i) => {
        const height = Math.floor(Math.random() * 65) + 20
        return (
          <div
            key={i}
            className="w-2 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm"
            style={{ height: `${height}%` }}
          />
        )
      })}
    </div>
  )
}

function CostTrendChart() {
  return (
    <div className="h-full w-full flex items-end justify-between px-2 relative">
      {Array.from({ length: 30 }).map((_, i) => {
        const height = Math.floor(Math.random() * 50) + 30
        return (
          <div
            key={i}
            className="w-2 bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm"
            style={{ height: `${height}%` }}
          />
        )
      })}
    </div>
  )
}

function EndpointRow({ endpoint, requests, percentage }: { endpoint: string; requests: number; percentage: number }) {
  return (
    <div className="bg-slate-800/30 rounded-md p-3 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-300 font-mono">{endpoint}</div>
        <div className="text-sm text-cyan-400">{requests.toLocaleString()}</div>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-slate-500 mt-1">{percentage}% of total</div>
    </div>
  )
}

function AgentPerformanceRow({
  name,
  type,
  requests,
  avgTime,
  successRate,
}: {
  name: string
  type: string
  requests: number
  avgTime: number
  successRate: number
}) {
  return (
    <div className="bg-slate-800/30 rounded-md p-3 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-sm text-slate-300 font-medium">{name}</div>
          <div className="text-xs text-slate-500">{type}</div>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
          {successRate}%
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-4 text-xs">
        <div>
          <div className="text-slate-500">Requests</div>
          <div className="text-slate-300 font-medium">{requests.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-slate-500">Avg Time</div>
          <div className="text-slate-300 font-medium">{avgTime}ms</div>
        </div>
        <div>
          <div className="text-slate-500">Success</div>
          <div className="text-green-400 font-medium">{successRate}%</div>
        </div>
      </div>
    </div>
  )
}

function CostBreakdownRow({ service, cost, percentage }: { service: string; cost: number; percentage: number }) {
  return (
    <div className="bg-slate-800/30 rounded-md p-3 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-300">{service}</div>
        <div className="text-sm text-green-400">${cost.toLocaleString()}</div>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-slate-500 mt-1">{percentage}% of total</div>
    </div>
  )
}
