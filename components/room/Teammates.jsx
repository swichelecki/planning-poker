const Teammates = ({ teammates, room }) => {
  if (!teammates || teammates?.length <= 0) return <></>;

  let roomFormatted = room;
  roomFormatted = roomFormatted.split('_').slice(0, -1);
  roomFormatted = roomFormatted.join(' ');

  return (
    <section className='teammates-list'>
      <h2>{roomFormatted}</h2>
      <ul>
        {teammates?.map((teammate, index) => (
          <li key={`teammate__${index}`}>{teammate}</li>
        ))}
      </ul>
      {/* for mobile <button>Teammates</button> */}
    </section>
  );
};

export default Teammates;
