'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '../../context';
import { socket } from '../../lib/socketClient';
import { Teammates, Votes, Card, Modal } from '../../components';
import { CARDS } from '../../constants';

const Room = () => {
  const { setShowModal } = useAppContext();
  const searchParams = useSearchParams();

  const username = searchParams.get('username');
  const room = searchParams.get('room');

  const [teammates, setTeammates] = useState([username]);
  const [votes, setVotes] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  // web sockets update ui after actions taken by other users in the room
  useEffect(() => {
    socket.on('user_joined', (username) => {
      setTeammates((curr) => [...curr, username]);
      console.log('FRONT END user joined: ', username);
    });

    socket.on('new_vote', (vote) => {
      console.log('FE votes ', vote);
      setVotes((curr) => [...curr, vote]);
    });

    socket.on('clear_votes', () => {
      console.log('FE clear votes');
      setShowModal(null);
      setHasVoted(false);
      setVotes([]);
    });

    return () => {
      socket.off('user_joined');
      socket.off('new_vote');
      socket.off('clear_votes');
    };
  }, []);

  // handle join room
  useEffect(() => {
    if (room && username) socket.emit('join-room', { room, username });
  }, []);

  // show modal after voting
  useEffect(() => {
    if (!hasVoted) return;
    setShowModal(
      <Modal setVotes={setVotes} setHasVoted={setHasVoted} room={room}>
        <Votes votes={votes} />
      </Modal>
    );
  }, [hasVoted, votes]);

  // handle voting
  const handleVote = (symbol, username) => {
    const vote = { symbol, username };
    setVotes((curr) => [...curr, { symbol, username }]);
    setHasVoted(true);
    socket.emit('new-vote', { room, vote });
  };

  return (
    <>
      <Teammates teammates={teammates} room={room} />
      <div className='room__room-wrapper'>
        <section className='room__card-wrapper'>
          {CARDS.map((item, index) => (
            <Card
              key={`card_${item}`}
              symbol={item}
              index={index}
              username={username}
              handleVote={handleVote}
              room={room}
            />
          ))}
        </section>
      </div>
    </>
  );
};

export default Room;
