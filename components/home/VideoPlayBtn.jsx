'use client';

import { useRef } from 'react';
import { MdPlayCircle } from 'react-icons/md';

const VideoPlayBtn = () => {
  const playBtnRef = useRef(null);

  const handlePlayBtn = () => {
    const videoPlayer = document.getElementById('homeVideo');
    if (!videoPlayer) return;
    videoPlayer.play();
    playBtnRef.current.remove();
  };

  return (
    <button
      type='button'
      onClick={handlePlayBtn}
      ref={playBtnRef}
      className='homepage__play-button'
      aria-label='Play Agile Story Planning Poker demo video'
    >
      <MdPlayCircle />
    </button>
  );
};

export default VideoPlayBtn;
