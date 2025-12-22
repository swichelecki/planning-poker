'use client';

import { useEffect, useRef } from 'react';
import { socket } from '../../lib/socketClient';
import { CTA } from '../../components';

const Modal = ({ children, room }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    modalRef.current.showModal();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleCloseModal();
    };

    if (document && typeof document !== 'undefined') {
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  const handleCloseModal = () => {
    socket.emit('clear-votes', { room });
  };

  return (
    <dialog ref={modalRef} className='modal'>
      <div className='modal__inner-wrapper'>
        {children}
        <CTA
          handleClick={handleCloseModal}
          btnType='button'
          text='Clear'
          className='cta-button cta-button--small cta-button--black'
        />
      </div>
    </dialog>
  );
};

export default Modal;
