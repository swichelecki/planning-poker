'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '../../context';
import { socket } from '../../lib/socketClient';
import { Teammates, Card, Modal } from '../../components';
import { CARDS } from '../../constants';

const teammatesDummyData = ['Steve Wichelecki', 'Bumbo Chumbo', 'Bumbo Whumbo'];

const Room = () => {
  const { setShowModal } = useAppContext();

  // TODO: get from Global state:
  // const [room, setRoom] = useState('');

  // I believe this updates UI for other people in the room
  useEffect(() => {
    socket.on('user_joined', (message) => {
      console.log('FE message: ', message);
    });

    return () => {
      socket.off('user_joined');
      //socket.off('vote');
    };
  }, []);

  //handles the current user's ui and passes changes to server
  // TODO: put user info into global context on login / signup and use in dependancy array
  useEffect(() => {
    //if (!room && !username) return;
    const room = 'Shure Web Team';
    const username = 'Steve Wichelecki';
    socket.emit('join-room', { room, username });
  }, []);

  const handleShowModal = (symbol) => {
    setShowModal(
      <Modal>
        <ul>
          {teammatesDummyData.map((teammate, index) => (
            <li key={`teammate__${index}`}>{teammate}</li>
          ))}
        </ul>
      </Modal>
    );
  };

  return (
    <>
      <Teammates teammates={teammatesDummyData} />
      <div className='room__room-wrapper'>
        <section className='room__card-wrapper'>
          {CARDS.map((item, index) => (
            <Card
              key={`card_${item}`}
              symbol={item}
              index={index}
              handleShowModal={handleShowModal}
            />
          ))}
        </section>
      </div>
    </>
  );
};

export default Room;
