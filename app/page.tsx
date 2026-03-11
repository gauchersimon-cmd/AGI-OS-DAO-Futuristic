'use client'

import { useState } from 'react'
import Dashboard from '@/components/dashboard'
import { WelcomeScreen } from '@/components/welcome-screen'

export default function Page() {
  const [showDashboard, setShowDashboard] = useState(false)

  if (!showDashboard) {
    return <WelcomeScreen onContinue={() => setShowDashboard(true)} />
  }

  return <Dashboard />
}
