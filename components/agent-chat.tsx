"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User } from "lucide-react"

interface AgentChatProps {
  agentId: string
  agentName: string
  specialization: string
  onClose: () => void
}

export function AgentChat({ agentId, agentName, specialization, onClose }: AgentChatProps) {
  const [input, setInput] = useState("")

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/agent/chat",
      body: { agentId, specialization },
    }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage({ text: input })
    setInput("")
  }

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/80 backdrop-blur-sm">
      <div className="flex overflow-hidden flex-col w-full max-w-2xl h-[600px] bg-slate-900/95 rounded-lg border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
        <div className="flex justify-between items-center p-4 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
          <div className="flex gap-3 items-center">
            <Bot className="w-6 h-6 text-cyan-400" />
            <div>
              <h3 className="font-bold text-white">{agentName}</h3>
              <p className="text-xs text-cyan-400">{specialization} Agent</p>
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/10">
            ✕
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="flex justify-center items-center w-8 h-8 bg-cyan-500/20 rounded-full border border-cyan-500/30">
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-purple-500/20 border border-purple-500/30"
                      : "bg-slate-800/50 border border-cyan-500/20"
                  }`}
                >
                  {message.parts.map((part, idx) => {
                    if (part.type === "text") {
                      return (
                        <p key={idx} className="text-sm text-white whitespace-pre-wrap">
                          {part.text}
                        </p>
                      )
                    }
                    return null
                  })}
                </div>
                {message.role === "user" && (
                  <div className="flex justify-center items-center w-8 h-8 bg-purple-500/20 rounded-full border border-purple-500/30">
                    <User className="w-4 h-4 text-purple-400" />
                  </div>
                )}
              </div>
            ))}
            {status === "in_progress" && (
              <div className="flex gap-3 justify-start">
                <div className="flex justify-center items-center w-8 h-8 bg-cyan-500/20 rounded-full border border-cyan-500/30">
                  <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-cyan-500/20">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="p-4 border-t border-cyan-500/30 bg-slate-900/50">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message the agent..."
              disabled={status === "in_progress"}
              className="flex-1 bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-500"
            />
            <Button
              type="submit"
              disabled={status === "in_progress" || !input.trim()}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
