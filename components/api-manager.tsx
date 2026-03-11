"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Globe, Cloud, DollarSign, TrendingUp, CheckCircle2 } from "lucide-react"

interface APIService {
  id: string
  name: string
  provider: string
  status: "active" | "inactive"
  calls: number
  limit: number
  cost: number
  icon: any
}

export function APIManager() {
  const [services] = useState<APIService[]>([
    {
      id: "1",
      name: "Claude AI",
      provider: "RapidAPI",
      status: "active",
      calls: 1247,
      limit: 10000,
      cost: 12.47,
      icon: Zap,
    },
    {
      id: "2",
      name: "Web Search",
      provider: "RapidAPI",
      status: "active",
      calls: 856,
      limit: 5000,
      cost: 4.28,
      icon: Globe,
    },
    {
      id: "3",
      name: "Weather API",
      provider: "RapidAPI",
      status: "active",
      calls: 342,
      limit: 2000,
      cost: 1.71,
      icon: Cloud,
    },
    {
      id: "4",
      name: "Crypto Prices",
      provider: "RapidAPI",
      status: "active",
      calls: 523,
      limit: 3000,
      cost: 2.62,
      icon: DollarSign,
    },
    {
      id: "5",
      name: "Translation",
      provider: "RapidAPI",
      status: "active",
      calls: 189,
      limit: 1000,
      cost: 0.95,
      icon: Globe,
    },
  ])

  const totalCost = services.reduce((sum, s) => sum + s.cost, 0)
  const totalCalls = services.reduce((sum, s) => sum + s.calls, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total API Calls</p>
                <p className="text-3xl font-bold text-cyan-400">{totalCalls.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Services</p>
                <p className="text-3xl font-bold text-purple-400">{services.length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Monthly Cost</p>
                <p className="text-3xl font-bold text-green-400">${totalCost.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-slate-100">API Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => {
              const Icon = service.icon
              const usage = (service.calls / service.limit) * 100

              return (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg">
                      <Icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-slate-100">{service.name}</h3>
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-500/50 text-xs">
                          {service.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400">{service.provider}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span>
                            {service.calls.toLocaleString()} / {service.limit.toLocaleString()} calls
                          </span>
                          <span>{usage.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                            style={{ width: `${usage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-slate-100">${service.cost.toFixed(2)}</p>
                    <p className="text-xs text-slate-400">this month</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
