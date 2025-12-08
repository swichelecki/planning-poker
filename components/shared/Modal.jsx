'use client';

import { useEffect, useRef } from 'react';
import { useAppContext } from '../../context';
import { socket } from '../../lib/socketClient';
import { CTA } from '../../components';
//import { useInnerHeight } from '../../hooks';
//import { handleModalResetPageScrolling } from '../../utilities';
//import { IoClose } from 'react-icons/io5';

const Modal = ({
  children,
  setVotes,
  setHasVoted,
  room,
  //showCloseButton = true,
  //closeModalWhenClickingOutside = false,
}) => {
  const modalRef = useRef(null);

  //const innerHeight = useInnerHeight();

  const { setShowModal } = useAppContext();

  useEffect(() => {
    modalRef.current.showModal();
    /*    window.scrollTo(0, 0);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleCloseModal();
    };

    const handleCloseModalWhenClickingOutside = (e) => {
      if (e.target === modalRef.current && closeModalWhenClickingOutside)
        handleCloseModal();
    };

    if (document && typeof document !== 'undefined') {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('click', handleCloseModalWhenClickingOutside);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener(
          'click',
          handleCloseModalWhenClickingOutside
        );
      };
    } */
  }, []);

  /*   useEffect(() => {
    const modalHeight = modalRef?.current?.offsetHeight;
    const appWrapper = document.querySelector('.app-wrapper');

    // when modal is taller than viewport limit scrolling to height of modal
    if (innerHeight && modalHeight >= innerHeight) {
      const pageScrollingRestrictedHeight = modalHeight + 32;
      appWrapper.setAttribute(
        'style',
        `height: ${pageScrollingRestrictedHeight}px; overflow: hidden;`
      );
    }

    // when modal is shorter than viewport prevent scrolling
    if (innerHeight && modalHeight < innerHeight) {
      appWrapper.setAttribute(
        'style',
        `height: ${innerHeight}px; overflow: hidden;`
      );
    }
  }, [innerHeight]); */

  const handleCloseModal = () => {
    setShowModal(null);
    setVotes([]);
    setHasVoted(false);
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
