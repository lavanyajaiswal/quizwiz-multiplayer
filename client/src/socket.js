
import { io } from 'socket.io-client'

export function createSocket(){
  const url = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000'
  const s = io(url, { autoConnect: true, transports: ['websocket'] })
  return s
}
