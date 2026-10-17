const UserCreatedEmail = ({ username, room }) => {
  return (
    <div>
      <p>
        <strong>Username:</strong> {username}
      </p>
      <p>
        <strong>Room:</strong> {room}
      </p>
    </div>
  );
};

export default UserCreatedEmail;
