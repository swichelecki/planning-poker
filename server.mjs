import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);

  const teammates = {};
  const rooms = {};

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-room', ({ room, username }) => {
      socket.join(room);

      if (teammates[room]) {
        teammates[room].push({ username, socket: socket.id });
        rooms[socket.id] = room;
      } else {
        teammates[room] = [];
        teammates[room].push({ username, socket: socket.id });
        rooms[socket.id] = room;
      }

      io.to(room).emit('user_joined', teammates[room]);

      console.log(`User ${username} joined room ${room}`);
    });

    socket.on('new-vote', ({ room, vote }) => {
      io.to(room).emit('new_vote', vote);
    });

    socket.on('clear-votes', ({ room }) => {
      io.to(room).emit('clear_votes', room);
    });

    // clean up in-memory state when user disconnects
    socket.on('disconnect', () => {
      console.log(`User disconnected ${socket.id}`);
      console.log('teammates before ', teammates);
      console.log('rooms before ', rooms);

      for (let i = teammates[rooms[socket.id]].length - 1; i >= 0; i--) {
        if (teammates[rooms[socket.id]][i].socket === socket.id) {
          teammates[rooms[socket.id]].splice([i], 1);
        }
      }

      if (teammates[rooms[socket.id]].length <= 0) {
        delete teammates[rooms[socket.id]];
      }

      console.log('teammates after ', teammates);
      console.log('rooms after ', rooms);
      socket
        .to([rooms[socket.id]])
        .emit('teammate_left_room', teammates[rooms[socket.id]]);

      delete rooms[socket.id];
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server running on http://${hostname}:${port}`);
  });
});
