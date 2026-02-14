'use client';

import { CTA } from '..';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const ModalStoryLinks = ({ room, socket, storyIndex, storyArrayLength }) => {
  if (!storyArrayLength) return;

  const handleChangeStory = (index) => {
    if (socket) {
      socket.emit('clear-votes', { room });
      socket.emit('change-story', { room, index });
    }
  };

  return (
    <div className='modal-story-select'>
      <div className='modal-story-select__wrapper'>
        <CTA
          icon={<FaChevronLeft />}
          className='cta-button cta-button--icon cta-button--icon-white'
          ariaLabel='Move to Previous User Story'
          btnType='button'
          disabled={storyIndex === 0}
          handleClick={() => {
            handleChangeStory(storyIndex - 1);
          }}
        />
        <p>Story {storyIndex + 1}</p>
        <CTA
          icon={<FaChevronRight />}
          className='cta-button cta-button--icon cta-button--icon-white'
          ariaLabel='Move to Next User Story'
          btnType='button'
          disabled={storyIndex === storyArrayLength - 1}
          handleClick={() => {
            handleChangeStory(storyIndex + 1);
          }}
        />
      </div>
    </div>
  );
};

export default ModalStoryLinks;
