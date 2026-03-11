'use client'

import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const chartData = [
  { time: '00:00', tasks: 12, agents: 4, errors: 0 },
  { time: '06:00', tasks: 24, agents: 5, errors: 1 },
  { time: '12:00', tasks: 42, agents: 6, errors: 2 },
  { time: '18:00', tasks: 36, agents: 5, errors: 1 },
  { time: '23:59', tasks: 18, agents: 3, errors: 0 },
]

export function AgentActivityGraph() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-80 p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-cyan-500/30"
    >
      <div className="text-sm text-cyan-400 mb-4 font-semibold">Agent Activity (24h)</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
          <XAxis dataKey="time" stroke="rgba(6, 182, 212, 0.5)" />
          <YAxis stroke="rgba(6, 182, 212, 0.5)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'rgba(6, 182, 212, 1)' }}
          />
          <Line
            type="monotone"
            dataKey="tasks"
            stroke="rgba(34, 197, 94, 1)"
            strokeWidth={2}
            dot={{ fill: 'rgba(34, 197, 94, 1)', r: 4 }}
            name="Tasks"
          />
          <Line
            type="monotone"
            dataKey="agents"
            stroke="rgba(6, 182, 212, 1)"
            strokeWidth={2}
            dot={{ fill: 'rgba(6, 182, 212, 1)', r: 4 }}
            name="Agents"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
