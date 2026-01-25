'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '../../context';
import { getSocket } from '../../lib/socketClient';
import { Teammates, Votes, Card, Indicator, Modal } from '../../components';
import { useScrollToTop } from '../../hooks';
import { CARDS } from '../../constants';

const Room = ({ user }) => {
  const { userId, isAdmin } = user;
  const { setShowModal, setUserId, setIsAdmin } = useAppContext();
  const searchParams = useSearchParams();
  useScrollToTop();

  const hasEmittedJoinRef = useRef(false);
  const socketRef = useRef(null);

  const userNamencoded = searchParams.get('username');
  const username = decodeURI(userNamencoded);
  const roomEncoded = searchParams.get('room');
  const room = decodeURI(roomEncoded);

  const [teammates, setTeammates] = useState([]);
  const [votes, setVotes] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoteComplete, setIsVoteComplete] = useState(false);

  // set global state
  useEffect(() => {
    setUserId(userId);
    setIsAdmin(isAdmin);
  }, [userId, isAdmin]);

  // initialize socket only in this component
  useEffect(() => {
    socketRef.current = getSocket();
    if (!socketRef.current.connected) {
      socketRef.current.connect();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // handle join room
  useEffect(() => {
    if (room && username && !hasEmittedJoinRef.current && socketRef.current) {
      hasEmittedJoinRef.current = true;
      socketRef.current.emit('join-room', { room, username });
    }
  }, [room, username]);

  // web sockets ui updates
  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on('user_joined', (teammates) => {
      setTeammates(teammates);
      setVotes(
        teammates.map((item) => {
          return { symbol: '', username: item.username };
        }),
      );
    });

    socketRef.current.on('new_vote', (vote) => {
      setVotes((prevVotes) =>
        prevVotes.map((item) => {
          if (item.username !== vote.username) {
            return item;
          } else {
            return vote;
          }
        }),
      );
    });

    socketRef.current.on('clear_votes', () => {
      setShowModal(null);
      setHasVoted(false);
      setIsVoteComplete(false);
      setVotes((prevVotes) =>
        prevVotes.map((item) => {
          return { symbol: '', username: item.username };
        }),
      );
    });

    socketRef.current.on('teammate_left_room', (teammates) => {
      setTeammates(teammates);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('user_joined');
        socketRef.current.off('new_vote');
        socketRef.current.off('clear_votes');
        socketRef.current.off('teammate_left_room');
      }
    };
  }, []);

  // show modal after voting
  useEffect(() => {
    if (!hasVoted) return;
    setShowModal(
      <Modal
        setVotes={setVotes}
        setHasVoted={setHasVoted}
        room={room}
        socket={socketRef.current}
      >
        <Votes votes={votes} isVoteComplete={isVoteComplete} />
      </Modal>,
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
    socketRef.current.emit('new-vote', { room, vote });
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
          <Indicator room={room} socket={socketRef.current} />
        )}
      </div>
    </>
  );
};

export default Room;
