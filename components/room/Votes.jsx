import { GiCoffeeMug } from 'react-icons/gi';
import { ImCheckmark } from 'react-icons/im';

const Votes = ({ votes, isVoteComplete }) => {
  return (
    <ul className='votes'>
      {votes.map((item, index) => (
        <li key={`teammate__${index}`}>
          <span>
            {!item?.symbol ? (
              <div className='loader'></div>
            ) : !isVoteComplete ? (
              <span className='votes__green-checkmark'>
                <ImCheckmark />
              </span>
            ) : item?.symbol !== 'coffee' ? (
              item?.symbol
            ) : (
              <GiCoffeeMug />
            )}
          </span>
          {item?.username}
        </li>
      ))}
    </ul>
  );
};

export default Votes;
