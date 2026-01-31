import { CTA } from '../../components';
import { TbPlayCard2Filled } from 'react-icons/tb';

const Indicator = ({ room, socket }) => {
  const handleCloseModal = () => {
    if (socket) {
      socket.emit('clear-votes', { room });
    }
  };

  return (
    <div className='indicator'>
      <CTA
        handleClick={handleCloseModal}
        btnType='button'
        text='Clear'
        ariaLabel='Reset Voting'
        className='cta-button cta-button--small cta-button--black'
      />
      <div className='indicator__spinner'>
        <svg id='spinnerText' width='250' height='250'>
          <path id='curve' d='M 25 125 A 28 28 0 1 1 25 127' />
          <text>
            <textPath href='#curve'>Voting in Progress &bull;</textPath>
          </text>
        </svg>
        <TbPlayCard2Filled />
      </div>
    </div>
  );
};

export default Indicator;
