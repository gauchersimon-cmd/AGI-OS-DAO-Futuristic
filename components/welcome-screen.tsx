'use client'

import { motion } from 'framer-motion'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Zap, Brain, Network, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}

const logoVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
      duration: 1,
    },
  },
}

interface WelcomeScreenProps {
  onContinue: () => void
}

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  const handleContinue = useCallback(() => {
    toast.success('🚀 Initializing AGI OS-DAO...', { duration: 2000 })
    setTimeout(onContinue, 500)
  }, [onContinue])

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center px-4"
    >
      {/* Logo */}
      <motion.div variants={logoVariants} className="mb-12">
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center border-2 border-cyan-500/50">
          <Brain className="w-12 h-12 text-cyan-400" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-purple-400"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </motion.div>

      {/* Title & Description */}
      <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold text-white text-center mb-4">
        AGI OS-DAO
      </motion.h1>
      <motion.p variants={itemVariants} className="text-lg text-cyan-400 text-center mb-12 max-w-2xl">
        Decentralized Artificial Intelligence Operating System with DAO Governance
      </motion.p>

      {/* Features */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl">
        {[
          { icon: Brain, label: '6 AI Agents', desc: 'Reasoning, Vision, Language, Code, Research, Analysis' },
          { icon: Zap, label: '100% Free APIs', desc: 'DuckDuckGo, Open-Meteo, Judge0, MyMemory' },
          { icon: Network, label: 'DAO Powered', desc: 'Community governance & voting system' },
        ].map(({ icon: Icon, label, desc }, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="p-6 bg-slate-800/50 rounded-lg border border-cyan-500/20 hover:border-cyan-500/50 transition-colors"
          >
            <Icon className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="font-bold text-white mb-2">{label}</h3>
            <p className="text-sm text-cyan-400/70">{desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* What's New */}
      <motion.div variants={itemVariants} className="p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/30 max-w-2xl mb-12">
        <div className="flex gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-cyan-400 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-white mb-2">✨ Just Added Today</h3>
            <ul className="text-sm text-cyan-400/80 space-y-2">
              <li>🎨 Framer Motion animations</li>
              <li>📊 Real-time metrics & charts (Recharts)</li>
              <li>🎯 Zustand state management</li>
              <li>⚡ TanStack Query for data fetching</li>
              <li>🔔 Sonner notifications</li>
              <li>💻 Monaco code editor (ready)</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div variants={itemVariants}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleContinue}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-bold text-lg"
          >
            Launch Dashboard →
          </Button>
        </motion.div>
      </motion.div>

      {/* Setup Link */}
      <motion.div variants={itemVariants} className="mt-8">
        <Link href="/setup">
          <Button variant="ghost" className="text-cyan-400/70 hover:text-cyan-400">
            Guide d'installation (Windows/Mac/Linux)
          </Button>
        </Link>
      </motion.div>

      {/* Version */}
      <motion.p variants={itemVariants} className="mt-4 text-xs text-cyan-400/50">
        AGI OS-DAO v3.0.0 • Cross-Platform Edition • Demo Mode Available
      </motion.p>
    </motion.div>
  )
}
