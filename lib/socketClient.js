'use client';

import { io } from 'socket.io-client';
export const socket = io(
  process.env.NEXT_PUBLIC_URL || window.location.origin,
  {
    transports: ['websocket'],
    withCredentials: true,
  },
);
