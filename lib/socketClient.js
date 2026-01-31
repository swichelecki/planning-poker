'use client';

import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_URL || window.location.origin, {
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socket;
};
