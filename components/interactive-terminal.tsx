"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, Send, Maximize2, Minimize2, Copy, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useTerminal } from "@/hooks/useTerminal"

interface TerminalLine {
  type: "command" | "output" | "error" | "success" | "info"
  content: string
  timestamp: Date
}

const COMMANDS = {
  help: "Display available commands",
  clear: "Clear terminal history",
  ai: "Ask AI a question - Usage: ai <your question>",
  search: "Search the web - Usage: search <query>",
  "analyze-image": "Analyze an image - Usage: analyze-image <url>",
  translate: "Translate text - Usage: translate <lang> <text>",
  weather: "Get weather info - Usage: weather <city>",
  "agent.list": "List all agents",
  "agent.create": "Create a new agent - Usage: agent.create <name> <type>",
  "agent.start": "Start an agent - Usage: agent.start <id>",
  "agent.stop": "Stop an agent - Usage: agent.stop <id>",
  "dao.proposals": "List all DAO proposals",
  "dao.vote": "Vote on a proposal - Usage: dao.vote <id> <for|against>",
  "system.status": "Display system status",
}

export function InteractiveTerminal() {
  const terminalHook = useTerminal()
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isMaximized, setIsMaximized] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const lines = terminalHook.lines

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  const addLine = (type: TerminalLine["type"], content: string) => {
    // Using Zustand store internally via hook
  }

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return

    addLine("command", `$ ${trimmedCmd}`)
    setHistory((prev) => [...prev, trimmedCmd])
    setHistoryIndex(-1)

    const [command] = trimmedCmd.split(" ")

    if (command === "clear") {
      setLines([])
      return
    }

    if (command === "help") {
      addLine("info", "Available Commands:")
      addLine("info", "")
      addLine("success", "AI & EXTERNAL APIs:")
      addLine("output", "  ai <question>           - Ask AI via Claude (RapidAPI)")
      addLine("output", "  search <query>          - Search the web")
      addLine("output", "  analyze-image <url>     - Analyze an image")
      addLine("output", "  translate <lang> <text> - Translate text")
      addLine("output", "  weather <city>          - Get weather info")
      addLine("output", "  crypto <symbol>         - Get crypto price")
      addLine("info", "")
      addLine("success", "AGENT MANAGEMENT:")
      addLine("output", "  agent list              - List all agents")
      addLine("output", "  agent create <name>     - Create new agent")
      addLine("output", "  agent start <id>        - Start agent")
      addLine("output", "  agent stop <id>         - Stop agent")
      addLine("info", "")
      addLine("success", "DAO GOVERNANCE:")
      addLine("output", "  dao proposals           - List proposals")
      addLine("output", "  dao vote <id> <for|against> - Vote")
      addLine("info", "")
      addLine("success", "SYSTEM:")
      addLine("output", "  system status           - Show system status")
      addLine("output", "  clear                   - Clear terminal")
      return
    }

    try {
      setIsLoading(true)
      addLine("info", "⏳ Executing command...")

      const response = await fetch("/api/terminal/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: trimmedCmd }),
      })

      const result = await response.json()

      if (result.clear) {
        setLines([])
        return
      }

      if (response.ok) {
        result.output.split("\n").forEach((line: string) => {
          if (line.trim()) {
            addLine("output", line)
          }
        })
      } else {
        addLine("error", result.output || "Command execution failed")
      }
    } catch (error) {
      addLine("error", "Failed to execute command. Check your connection.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      executeCommand(input)
      setInput("")
      setSuggestions([])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)

    if (value.trim()) {
      const matches = Object.keys(COMMANDS).filter((cmd) => cmd.startsWith(value.trim()))
      setSuggestions(matches.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= history.length) {
          setHistoryIndex(-1)
          setInput("")
        } else {
          setHistoryIndex(newIndex)
          setInput(history[newIndex])
        }
      }
    } else if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault()
      setInput(suggestions[0])
      setSuggestions([])
    }
  }

  const handleClear = () => {
    setLines([
      {
        type: "info",
        content: "AGI OS-DAO Terminal v2.0.0 - RapidAPI Integration Active",
        timestamp: new Date(),
      },
      {
        type: "success",
        content: "Type 'help' for available commands | Try: ai, search, weather, crypto",
        timestamp: new Date(),
      },
    ])
  }

  const handleCopy = () => {
    const text = lines.map((line) => line.content).join("\n")
    navigator.clipboard.writeText(text)
    addLine("success", "✓ Terminal content copied to clipboard")
  }

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "command":
        return "text-cyan-400"
      case "output":
        return "text-slate-300"
      case "error":
        return "text-red-400"
      case "success":
        return "text-green-400"
      case "info":
        return "text-blue-400"
      default:
        return "text-slate-300"
    }
  }

  return (
    <Card className={`bg-slate-900/50 border-slate-700/50 backdrop-blur-sm ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <CardHeader className="pb-3 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-100 flex items-center text-base">
            <Terminal className="mr-2 h-5 w-5 text-cyan-500" />
            Interactive Terminal
            <Badge variant="outline" className="ml-2 bg-slate-800/50 text-cyan-400 border-cyan-500/50 text-xs">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></div>
              {isLoading ? "BUSY" : "READY"}
            </Badge>
            <Badge variant="outline" className="ml-2 bg-purple-900/30 text-purple-400 border-purple-500/50 text-xs">
              RapidAPI
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-8 w-8 text-slate-400 hover:text-slate-100"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-8 w-8 text-slate-400 hover:text-slate-100"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMaximized(!isMaximized)}
              className="h-8 w-8 text-slate-400 hover:text-slate-100"
            >
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={terminalRef}
          className={`bg-black/50 font-mono text-sm overflow-y-auto ${isMaximized ? "h-[calc(100vh-12rem)]" : "h-96"}`}
        >
          <div className="p-4 space-y-1">
            {lines.map((line, index) => (
              <div key={index} className={`${getLineColor(line.type)} leading-relaxed`}>
                {line.content}
              </div>
            ))}
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="border-t border-slate-700/50 bg-slate-800/50 p-2">
            <div className="text-xs text-slate-400 mb-1">Suggestions (press Tab):</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion)
                    setSuggestions([])
                    inputRef.current?.focus()
                  }}
                  className="px-2 py-1 bg-slate-700/50 hover:bg-slate-700 rounded text-xs text-cyan-400 border border-slate-600"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="border-t border-slate-700/50 p-4 bg-slate-900/50">
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400 font-mono">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a command... (try: ai, search, weather)"
              className="flex-1 bg-transparent border-none focus:outline-none text-slate-100 font-mono placeholder:text-slate-600"
              autoFocus
              disabled={isLoading}
            />
            <Button type="submit" size="sm" className="bg-cyan-600 hover:bg-cyan-700" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono">
            Press ↑/↓ for history, Tab for autocomplete | RapidAPI commands: ai, search, weather, crypto
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
