import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const initSocket = (url: string = 'http://localhost:8000') => {
  if (socket?.connected) return socket

  socket = io(url, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  })

  socket.on('connect', () => {
    console.log('✅ WebSocket connected')
  })

  socket.on('disconnect', () => {
    console.log('❌ WebSocket disconnected')
  })

  socket.on('error', (error) => {
    console.error('WebSocket error:', error)
  })

  return socket
}

export const getSocket = () => socket

export const emitTaskUpdate = (taskId: string, update: any) => {
  socket?.emit('task:update', { taskId, update })
}

export const onAgentStatusChange = (callback: (data: any) => void) => {
  socket?.on('agent:status', callback)
}

export const onTaskOutput = (callback: (data: any) => void) => {
  socket?.on('task:output', callback)
}
