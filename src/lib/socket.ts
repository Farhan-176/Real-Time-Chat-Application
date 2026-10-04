import { io, type Socket } from 'socket.io-client';

export function createSocket(token: string): Socket {
  return io(import.meta.env.VITE_SOCKET_URL || undefined, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });
}
