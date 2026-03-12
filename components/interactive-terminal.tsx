"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Terminal, Send, Maximize2, Minimize2, Copy, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useAppStore } from "@/lib/store"

const COMMANDS: Record<string, string> = {
  help: "Display available commands",
  clear: "Clear terminal history",
  ai: "Ask AI a question - Usage: ai <your question>",
  "agent.list": "List all agents",
  "agent.create": "Create a new agent - Usage: agent.create <name> <type>",
  "system.status": "Display system status",
  echo: "Echo text back - Usage: echo <text>",
  date: "Display current date and time",
  version: "Display system version",
}

export function InteractiveTerminal() {
  const { terminalLines, addTerminalLine, clearTerminal } = useAppStore()
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isMaximized, setIsMaximized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalLines])

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return

    addTerminalLine("command", `$ ${trimmedCmd}`)
    setHistory((prev) => [...prev, trimmedCmd])
    setHistoryIndex(-1)

    const [command, ...args] = trimmedCmd.split(" ")
    const argText = args.join(" ")

    // Handle local commands
    if (command === "clear") {
      clearTerminal()
      return
    }

    if (command === "help") {
      addTerminalLine("info", "")
      addTerminalLine("success", "=== AGI OS-DAO Terminal v3.0.0 ===")
      addTerminalLine("info", "")
      addTerminalLine("success", "AVAILABLE COMMANDS:")
      Object.entries(COMMANDS).forEach(([cmd, desc]) => {
        addTerminalLine("output", `  ${cmd.padEnd(20)} - ${desc}`)
      })
      addTerminalLine("info", "")
      addTerminalLine("info", "TIP: Use Tab for autocomplete, Arrow keys for history")
      return
    }

    if (command === "echo") {
      addTerminalLine("output", argText || "(empty)")
      return
    }

    if (command === "date") {
      addTerminalLine("output", new Date().toLocaleString())
      return
    }

    if (command === "version") {
      addTerminalLine("success", "AGI OS-DAO v3.0.0")
      addTerminalLine("output", "Build: 2026.03.11")
      addTerminalLine("output", "Node: Next.js 14")
      addTerminalLine("output", "UI: React 19 + Tailwind CSS")
      return
    }

    if (command === "system.status") {
      addTerminalLine("success", "=== SYSTEM STATUS ===")
      addTerminalLine("output", `  CPU Usage:    ${Math.floor(Math.random() * 30) + 50}%`)
      addTerminalLine("output", `  Memory:       ${Math.floor(Math.random() * 20) + 60}%`)
      addTerminalLine("output", `  Active Agents: 6`)
      addTerminalLine("output", `  Tasks Queue:   ${Math.floor(Math.random() * 50) + 10}`)
      addTerminalLine("output", `  Uptime:        ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`)
      addTerminalLine("success", "All systems operational")
      return
    }

    if (command === "agent.list") {
      addTerminalLine("success", "=== ACTIVE AGENTS ===")
      addTerminalLine("output", "  ID          NAME                TYPE        STATUS")
      addTerminalLine("output", "  agent-1     Reasoning Engine    reasoning   active")
      addTerminalLine("output", "  agent-2     Vision Processor    vision      active")
      addTerminalLine("output", "  agent-3     Language Model      language    active")
      addTerminalLine("output", "  agent-4     Code Assistant      code        idle")
      addTerminalLine("output", "  agent-5     Research Analyst    research    active")
      addTerminalLine("output", "  agent-6     Data Analyzer       analysis    paused")
      addTerminalLine("info", "")
      addTerminalLine("info", "Total: 6 agents | 4 active | 1 idle | 1 paused")
      return
    }

    if (command === "ai") {
      if (!argText) {
        addTerminalLine("error", "Usage: ai <your question>")
        return
      }

      setIsLoading(true)
      addTerminalLine("info", "Processing AI request...")

      try {
        const response = await fetch("/api/terminal/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command: trimmedCmd }),
        })

        const result = await response.json()

        if (response.ok) {
          result.output.split("\n").forEach((line: string) => {
            if (line.trim()) {
              addTerminalLine("output", line)
            }
          })
        } else {
          addTerminalLine("error", result.output || "Command execution failed")
        }
      } catch (error) {
        addTerminalLine("error", "Failed to execute AI command. Please try again.")
      } finally {
        setIsLoading(false)
      }
      return
    }

    // Unknown command
    addTerminalLine("error", `Command not found: ${command}`)
    addTerminalLine("info", "Type 'help' for available commands")
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
    clearTerminal()
    toast.success("Terminal cleared")
  }

  const handleCopy = () => {
    const text = terminalLines.map((line) => line.content).join("\n")
    navigator.clipboard.writeText(text)
    toast.success("Terminal content copied to clipboard")
  }

  const getLineColor = (type: string) => {
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
            {terminalLines.map((line, index) => (
              <div key={index} className={`${getLineColor(line.type)} leading-relaxed`}>
                {line.content}
              </div>
            ))}
            {isLoading && (
              <div className="text-cyan-400 animate-pulse">Processing...</div>
            )}
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
              placeholder="Type a command... (try: help, ai, agent.list)"
              className="flex-1 bg-transparent border-none focus:outline-none text-slate-100 font-mono placeholder:text-slate-600"
              autoFocus
              disabled={isLoading}
            />
            <Button type="submit" size="sm" className="bg-cyan-600 hover:bg-cyan-700" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono">
            Press Up/Down for history, Tab for autocomplete
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
