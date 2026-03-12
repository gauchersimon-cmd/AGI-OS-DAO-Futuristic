'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, Copy, ExternalLink, Terminal, Zap, Globe, Server } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const steps = [
  {
    title: "1. Clone le projet",
    icon: Terminal,
    commands: [
      "git clone https://github.com/gauchersimon-cmd/AGI-OS-DAO-Futuristic.git",
      "cd AGI-OS-DAO-Futuristic"
    ]
  },
  {
    title: "2. Installe les dependances",
    icon: Zap,
    commands: [
      "# Windows/Mac/Linux - choisis ton package manager:",
      "pnpm install   # Recommande",
      "npm install    # Alternative",
      "yarn install   # Alternative"
    ]
  },
  {
    title: "3. Configure les variables d'environnement",
    icon: Server,
    commands: [
      "# Cree un fichier .env.local a la racine:",
      "OPENAI_API_KEY=sk-your-key-here  # Optionnel - mode demo sans",
      "",
      "# Optionnel - pour Supabase:",
      "NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ..."
    ]
  },
  {
    title: "4. Lance l'application",
    icon: Globe,
    commands: [
      "# Development:",
      "pnpm dev",
      "",
      "# Production:",
      "pnpm build && pnpm start",
      "",
      "# Ouvre http://localhost:3000"
    ]
  }
]

export default function SetupPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    const cleanText = text.split('\n').filter(l => !l.startsWith('#')).join('\n')
    navigator.clipboard.writeText(cleanText)
    setCopied(text)
    toast.success('Copie dans le presse-papier!')
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Setup Guide</h1>
          <p className="text-cyan-400">Installation sur Windows, Mac ou Linux</p>
        </div>

        <div className="grid gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-cyan-500/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <step.icon className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-xl font-bold text-white">{step.title}</h2>
                </div>
                <div className="relative">
                  <pre className="bg-slate-900 rounded-lg p-4 text-sm text-cyan-300 overflow-x-auto">
                    {step.commands.join('\n')}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 text-cyan-400 hover:text-white"
                    onClick={() => copyToClipboard(step.commands.join('\n'))}
                  >
                    {copied === step.commands.join('\n') ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Scripts */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Scripts Rapides</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-900 rounded-lg p-4">
                <p className="text-cyan-400 font-mono text-sm mb-2">Windows (PowerShell):</p>
                <code className="text-white text-xs">.\start.bat</code>
              </div>
              <div className="bg-slate-900 rounded-lg p-4">
                <p className="text-cyan-400 font-mono text-sm mb-2">Mac/Linux:</p>
                <code className="text-white text-xs">chmod +x start.sh && ./start.sh</code>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Links */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Link href="/">
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500">
              Retour au Dashboard
            </Button>
          </Link>
          <a href="https://github.com/gauchersimon-cmd/AGI-OS-DAO-Futuristic" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-cyan-500/50 text-cyan-400">
              <ExternalLink className="w-4 h-4 mr-2" />
              GitHub Repo
            </Button>
          </a>
          <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-cyan-500/50 text-cyan-400">
              <ExternalLink className="w-4 h-4 mr-2" />
              Get OpenAI Key
            </Button>
          </a>
        </motion.div>

        {/* Compatibility */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center"
        >
          <p className="text-cyan-400/50 text-sm">
            Compatible: Windows 10/11 | macOS 12+ | Ubuntu 20.04+ | Node.js 18+
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
