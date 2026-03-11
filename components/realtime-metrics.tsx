'use client'

import { motion } from 'framer-motion'
import { useCallback } from 'react'
import { toast } from 'sonner'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

interface MetricProps {
  label: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down'
}

function MetricCard({ label, value, unit, trend }: MetricProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="p-4 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/30"
    >
      <div className="text-xs text-cyan-400 mb-2">{label}</div>
      <div className="flex items-baseline gap-2">
        <motion.span
          className="text-2xl font-bold text-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          {value}
        </motion.span>
        {unit && <span className="text-xs text-cyan-400">{unit}</span>}
      </div>
      {trend && (
        <motion.div
          className={`text-xs mt-2 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {trend === 'up' ? '↑' : '↓'} vs last hour
        </motion.div>
      )}
    </motion.div>
  )
}

export function RealtimeMetrics() {
  // Mock data - replace with real API integration
  const metrics: MetricProps[] = [
    { label: 'Active Agents', value: 6, trend: 'up' },
    { label: 'Running Tasks', value: 12, trend: 'up' },
    { label: 'API Calls/min', value: 234, unit: '/min' },
    { label: 'System CPU', value: 34, unit: '%' },
    { label: 'Memory', value: 2.4, unit: 'GB' },
    { label: 'DAO Members', value: 1247, trend: 'up' },
  ]

  const handleRefresh = useCallback(() => {
    toast.success('Metrics refreshed', { duration: 2000 })
  }, [])

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
    >
      {metrics.map((metric, idx) => (
        <MetricCard key={idx} {...metric} />
      ))}
    </motion.div>
  )
}
