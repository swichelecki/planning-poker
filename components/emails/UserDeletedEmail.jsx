const UserDeletedEmail = ({ email, createdAt }) => {
  return (
    <div>
      <p>
        <strong>Username:</strong> {email}
      </p>
      <p>
        <strong>Account Activation Date:</strong> {createdAt}
      </p>
    </div>
  );
};

export default UserDeletedEmail;
