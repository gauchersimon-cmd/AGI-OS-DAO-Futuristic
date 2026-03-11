'use client'

import type React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AnimatedCardProps {
  title?: string
  children: React.ReactNode
  delay?: number
  className?: string
}

export function AnimatedCard({ title, children, delay = 0, className = '' }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      <Card className="border-cyan-500/30 bg-slate-900/50 hover:bg-slate-900/80 transition-colors">
        {title && (
          <CardHeader>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.1 }}
            >
              <CardTitle className="text-cyan-400">{title}</CardTitle>
            </motion.div>
          </CardHeader>
        )}
        <CardContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            {children}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
