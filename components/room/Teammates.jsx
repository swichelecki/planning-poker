const Teammates = ({ teammates }) => {
  if (!teammates || teammates?.length <= 0) return <></>;

  return (
    <section className='teammates-list'>
      <h2>Shure Web Team</h2>
      <ul>
        {teammates.map((teammate, index) => (
          <li key={`teammate__${index}`}>{teammate}</li>
        ))}
      </ul>
      {/*  <button>Teammates</button> */}
    </section>
  );
};

export default Teammates;
