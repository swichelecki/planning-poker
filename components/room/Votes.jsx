import { GiCoffeeMug } from 'react-icons/gi';

const Votes = ({ votes }) => {
  return (
    <ul className='votes'>
      {votes.map((item, index) => (
        <li key={`teammate__${index}`}>
          <span>
            {item?.symbol !== 'coffee' ? item?.symbol : <GiCoffeeMug />}
          </span>
          {item?.username}
        </li>
      ))}
    </ul>
  );
};

export default Votes;
