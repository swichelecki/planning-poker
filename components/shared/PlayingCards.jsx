import { TbPlayCard2, TbPlayCard5 } from 'react-icons/tb';

const PlayingCards = ({ isHomepage }) => {
  return (
    <div className={`playing-cards ${isHomepage && 'playing-cards--large'}`}>
      <TbPlayCard2 />
      <TbPlayCard5 />
    </div>
  );
};

export default PlayingCards;
