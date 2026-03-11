"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Package,
  Download,
  Check,
  Star,
  Code,
  ImageIcon,
  Database,
  Globe,
  FileText,
  Calculator,
  Brain,
  MessageSquare,
  Music,
  Video,
  Mail,
  Calendar,
  Map,
} from "lucide-react"
import { db, type Tool } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

const iconMap: Record<string, any> = {
  Globe,
  ImageIcon,
  Code,
  Database,
  FileText,
  Calculator,
  MessageSquare,
  Music,
  Video,
  Mail,
  Calendar,
  Map,
}

export function ToolMarketplace() {
  const [tools, setTools] = useState<Tool[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    loadTools()
  }, [])

  const loadTools = async () => {
    try {
      const data = await db.getTools()
      setTools(data)
    } catch (error) {
      console.error("[v0] Error loading tools:", error)
      setTools([
        {
          id: "1",
          name: "Web Search",
          category: "ai",
          description: "Advanced web search with semantic understanding",
          cost: 50,
          rating: 4.8,
          downloads: 12450,
          installed: true,
          icon: "Globe",
          provider: "SearchAI",
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Image Generator",
          category: "ai",
          description: "Generate high-quality images from text descriptions",
          cost: 100,
          rating: 4.9,
          downloads: 8920,
          installed: true,
          icon: "ImageIcon",
          provider: "ImageAI",
          created_at: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Code Interpreter",
          category: "utility",
          description: "Execute and analyze code in multiple languages",
          cost: 75,
          rating: 4.7,
          downloads: 15230,
          installed: false,
          icon: "Code",
          provider: "CodeAI",
          created_at: new Date().toISOString(),
        },
        {
          id: "4",
          name: "Database Query",
          category: "data",
          description: "Natural language to SQL query conversion",
          cost: 60,
          rating: 4.6,
          downloads: 6780,
          installed: false,
          icon: "Database",
          provider: "DataAI",
          created_at: new Date().toISOString(),
        },
        {
          id: "5",
          name: "Document Parser",
          category: "utility",
          description: "Extract and analyze content from documents",
          cost: 40,
          rating: 4.5,
          downloads: 9340,
          installed: true,
          icon: "FileText",
          provider: "DocAI",
          created_at: new Date().toISOString(),
        },
        {
          id: "6",
          name: "Math Solver",
          category: "utility",
          description: "Solve complex mathematical problems",
          cost: 30,
          rating: 4.8,
          downloads: 11200,
          installed: false,
          icon: "Calculator",
          provider: "MathAI",
          created_at: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { id: "all", label: "All Tools", icon: Package },
    { id: "search", label: "Search", icon: Globe },
    { id: "image", label: "Image", icon: ImageIcon },
    { id: "code", label: "Code", icon: Code },
    { id: "database", label: "Database", icon: Database },
    { id: "document", label: "Document", icon: FileText },
    { id: "nlp", label: "NLP", icon: Brain },
    { id: "audio", label: "Audio", icon: Music },
    { id: "video", label: "Video", icon: Video },
    { id: "communication", label: "Communication", icon: Mail },
    { id: "productivity", label: "Productivity", icon: Calendar },
    { id: "location", label: "Location", icon: Map },
  ]

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleInstall = async (toolId: string) => {
    const tool = tools.find((t) => t.id === toolId)
    if (!tool) return

    try {
      const updated = await db.toggleToolInstallation(toolId, !tool.installed)
      setTools(tools.map((t) => (t.id === toolId ? updated : t)))

      toast({
        title: "Success",
        description: `Tool ${updated.installed ? "installed" : "uninstalled"} successfully`,
      })
    } catch (error) {
      console.error("[v0] Error toggling tool:", error)
      toast({
        title: "Error",
        description: "Failed to update tool",
        variant: "destructive",
      })
    }
  }

  const installedCount = tools.filter((t) => t.installed).length
  const totalCost = tools.filter((t) => t.installed).reduce((sum, t) => sum + t.cost, 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading tools...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-100 flex items-center text-xl">
                <Package className="mr-2 h-6 w-6 text-cyan-500" />
                Tool Marketplace
              </CardTitle>
              <CardDescription className="text-slate-400 mt-1">
                Discover and install tools to enhance your AI agents capabilities
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-slate-400">Installed Tools</div>
                <div className="text-2xl font-bold text-cyan-400">{installedCount}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">Monthly Cost</div>
                <div className="text-2xl font-bold text-purple-400">{totalCost} AGI</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search and filters */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-100"
              />
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-auto">
              <TabsList className="bg-slate-800/50">
                {categories.slice(0, 5).map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                  >
                    <cat.icon className="h-4 w-4 mr-1" />
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Tools grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => {
          const Icon = iconMap[tool.icon] || Package

          return (
            <Card
              key={tool.id}
              className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <Icon className="h-5 w-5 text-cyan-500" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-100 text-base">{tool.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        {tool.installed && (
                          <Badge className="text-xs bg-green-500/10 text-green-400 border-green-500/30">
                            <Check className="h-3 w-3 mr-1" />
                            Installed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-slate-400 mb-3">{tool.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                      {tool.rating}
                    </div>
                    <div className="flex items-center">
                      <Download className="h-3 w-3 mr-1" />
                      {tool.downloads.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-slate-400">{tool.provider}</div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-700/50 pt-3">
                <div className="flex items-center justify-between w-full">
                  <div className="text-sm">
                    {tool.cost === 0 ? (
                      <span className="text-green-400 font-medium">Free</span>
                    ) : (
                      <span className="text-purple-400 font-medium">{tool.cost} AGI/mo</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleInstall(tool.id)}
                    className={
                      tool.installed
                        ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                        : "bg-cyan-600 hover:bg-cyan-700"
                    }
                  >
                    {tool.installed ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Installed
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-1" />
                        Install
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {filteredTools.length === 0 && (
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No tools found matching your search</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
