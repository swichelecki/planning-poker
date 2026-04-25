import 'dotenv/config';
import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);

  const teammates = {};
  const rooms = {};
  const links = {};

  io.on('connection', (socket) => {
    // user joins room
    socket.on('join-room', ({ room, username, storyLinks }) => {
      if (!room || !username) return;
      socket.join(room);

      // user enters room with other teammates
      if (teammates[room]) {
        teammates[room].push({ username, socket: socket.id });
      } else {
        // user first to enter room
        teammates[room] = [];
        teammates[room].push({ username, socket: socket.id });
      }

      // associate user socket id with room joined
      rooms[socket.id] = room;

      // add story links
      if (JSON.parse(storyLinks).length > 0)
        links[room] = {
          linkArray: JSON.parse(storyLinks),
          currentIndex: 0,
          username,
        };

      // if story links exist in state and user has removed story links delete story link state
      if (
        JSON.parse(storyLinks).length <= 0 &&
        links[room] &&
        links[room].username === username
      )
        delete links[room];

      io.to(room).emit(
        'user_joined',
        teammates[room],
        links[room]
          ? links[room]['linkArray'][links[room]['currentIndex']]
          : '',
        links[room] ? links[room]['currentIndex'] : 0,
        links[room] ? links[room]['linkArray']?.length : 0,
      );
    });

    // user votes by clicking card
    socket.on('new-vote', ({ room, vote }) => {
      io.to(room).emit('new_vote', vote);
    });

    // clear all votes button click
    socket.on('clear-votes', ({ room }) => {
      io.to(room).emit('clear_votes', room);
    });

    // move to next or previous story
    socket.on('change-story', ({ room, index }) => {
      links[room]['currentIndex'] = index;
      io.to(room).emit('change_story', links[room]['linkArray'][index], index);
    });

    // clean up in-memory state when user disconnects
    socket.on('disconnect', () => {
      if (Object.keys(teammates).length <= 0 && Object.keys(rooms).length <= 0)
        return;

      // teammate object - delete user from teammates array when user socket disconnects
      for (let i = teammates[rooms[socket.id]].length - 1; i >= 0; i--) {
        if (teammates[rooms[socket.id]][i].socket === socket.id) {
          teammates[rooms[socket.id]].splice(i, 1);
        }
      }

      socket
        .to([rooms[socket.id]])
        .emit('teammate_left_room', teammates[rooms[socket.id]]);

      // links object - when all teammates have left room delete related story links object key/value
      if (links[rooms[socket.id]] && teammates[rooms[socket.id]].length <= 0) {
        delete links[rooms[socket.id]];
      }

      // teammates object - when all teammates have left room delete related teammate object key/value
      if (teammates[rooms[socket.id]].length <= 0) {
        delete teammates[rooms[socket.id]];
      }

      // room object - delete user key/value from room object when user disconnects
      delete rooms[socket.id];
    });
  });

  httpServer.listen(port, () => {
    console.log(`Socket.IO Server running on port ${port}`);
  });
});
