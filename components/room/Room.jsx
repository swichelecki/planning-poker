'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '../../context';
import { socket } from '../../lib/socketClient';
import { Teammates, Votes, Card, Indicator, Modal } from '../../components';
import { CARDS } from '../../constants';

const Room = ({ user }) => {
  const { userId, isAdmin } = user;
  const { setShowModal, setUserId, setIsAdmin } = useAppContext();
  const searchParams = useSearchParams();

  const hasEmittedJoinRef = useRef(false);

  const username = searchParams.get('username');
  const room = searchParams.get('room');

  const [teammates, setTeammates] = useState([]);
  const [votes, setVotes] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoteComplete, setIsVoteComplete] = useState(false);

  //  set global state
  useEffect(() => {
    setUserId(userId);
    setIsAdmin(isAdmin);
  }, [userId, isAdmin]);

  // web sockets ui updates
  useEffect(() => {
    socket.on('user_joined', (teammates) => {
      setTeammates(teammates);
      setVotes(
        teammates.map((item) => {
          return { symbol: '', username: item.username };
        })
      );
    });

    socket.on('new_vote', (vote) => {
      setVotes(
        votes.map((item) => {
          if (item.username !== vote.username) {
            return item;
          } else {
            return vote;
          }
        })
      );
    });

    socket.on('clear_votes', () => {
      setShowModal(null);
      setHasVoted(false);
      setIsVoteComplete(false);
      setVotes(
        votes.map((item) => {
          return { symbol: '', username: item.username };
        })
      );
    });

    socket.on('teammate_left_room', (teammates) => {
      setTeammates(teammates);
    });

    return () => {
      socket.off('user_joined');
      socket.off('new_vote');
      socket.off('clear_votes');
    };
  }, [votes]);

  // handle join room
  useEffect(() => {
    if (room && username && !hasEmittedJoinRef.current) {
      hasEmittedJoinRef.current = true;
      socket.emit('join-room', { room, username });
    }
  }, []);

  // show modal after voting
  useEffect(() => {
    if (!hasVoted) return;
    setShowModal(
      <Modal setVotes={setVotes} setHasVoted={setHasVoted} room={room}>
        <Votes votes={votes} isVoteComplete={isVoteComplete} />
      </Modal>
    );
  }, [hasVoted, votes, isVoteComplete]);

  // show green checkmark in modal while voting or votes when all have voted
  useEffect(() => {
    if (!votes || votes.length <= 0) return;
    if (!votes.some((item) => item.symbol.length <= 0)) setIsVoteComplete(true);
  }, [votes]);

  // handle voting
  const handleVote = (symbol, username) => {
    const vote = { symbol, username };
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
        {!hasVoted && votes.some((item) => item.symbol.length > 0) && (
          <Indicator room={room} />
        )}
      </div>
    </>
  );
};

export default Room;
