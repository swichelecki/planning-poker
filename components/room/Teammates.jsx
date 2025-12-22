import { handleRoomNameFormatting } from '../../utilities/handleRoomNameFormatting';

const Teammates = ({ teammates, room }) => {
  if (!teammates || teammates?.length <= 0) return <></>;

  return (
    <section className='teammates-list'>
      <h2>{handleRoomNameFormatting(room)}</h2>
      <ul>
        {teammates?.map((teammate, index) => (
          <li key={`teammate__${index}`}>{teammate.username}</li>
        ))}
      </ul>
      {/* for mobile <button>Teammates</button> */}
    </section>
  );
};

export default Teammates;
