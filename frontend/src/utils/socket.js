import { io } from 'socket.io-client';

let socket = null;

export const getSocketUrl = () => {
  const envUrl = process.env.REACT_APP_SOCKET_URL;
  if (envUrl && envUrl.trim() !== '') {
    if (
      typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1' &&
      envUrl.includes('localhost')
    ) {
      return 'https://kaamconnect-dhbs.onrender.com';
    }
    return envUrl.replace(/\/+$/, '');
  }

  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return 'https://kaamconnect-dhbs.onrender.com';
  }

  return 'http://localhost:5000';
};

export const initSocket = (token) => {
  if (socket?.connected) return socket;

  const url = getSocketUrl();
  socket = io(url, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => console.log('🔌 Socket connected to', url));
  socket.on('disconnect', (reason) => console.log('🔌 Socket disconnected:', reason));
  socket.on('connect_error', (err) => console.error('Socket error:', err.message));

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default { initSocket, getSocket, disconnectSocket, getSocketUrl };
