'use client'

import type React from 'react'
import { Providers } from '@/app/providers'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>
}
