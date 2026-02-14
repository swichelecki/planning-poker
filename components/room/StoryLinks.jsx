'use client';

import { CTA } from '../../components';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const StoryLinks = ({
  storyLink,
  room,
  socket,
  storyIndex,
  storyArrayLength,
}) => {
  if (!storyLink) return <></>;

  const handleChangeStory = (index) => {
    if (socket) {
      socket.emit('change-story', { room, index });
    }
  };

  return (
    <div className='story-links__outer-wrapper'>
      <p>Story {storyIndex + 1}</p>
      <div className='story-links__inner-wrapper'>
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
        <div className='story-links__current-link'>
          <a
            href={storyLink}
            target='_blank'
            aria-label={`Link to user story currently under discussion: ${storyLink}`}
          >
            {storyLink}
          </a>
        </div>
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

export default StoryLinks;
