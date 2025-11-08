const UserCreatedEmail = ({ firstName, lastName, email }) => {
  return (
    <div>
      <p>
        <strong>First Name:</strong> {firstName}
      </p>
      <p>
        <strong>Last Name:</strong> {lastName}
      </p>
      <p>
        <strong>Email:</strong> {email}
      </p>
    </div>
  );
};

export default UserCreatedEmail;
