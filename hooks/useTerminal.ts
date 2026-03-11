import { useAppStore } from '@/lib/store'
import type { TerminalState } from '@/lib/store'

export const useTerminal = () => {
  const { terminalLines, addTerminalLine, clearTerminal } = useAppStore()

  const execute = async (command: string) => {
    addTerminalLine('command', `$ ${command}`)

    try {
      const res = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      })

      if (!res.ok) {
        addTerminalLine('error', `Error: ${res.statusText}`)
        return
      }

      const data = await res.json()
      addTerminalLine('output', data.output || JSON.stringify(data))
    } catch (error) {
      addTerminalLine('error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return {
    lines: terminalLines,
    execute,
    clear: clearTerminal,
  }
}
