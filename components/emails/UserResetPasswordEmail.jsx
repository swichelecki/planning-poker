const UserRequestPasswordResetEmail = ({ hashedUserId, email }) => {
  return (
    <div>
      <p>
        A request was made to reset the Agile Story Planning Poker password for
        the account associated with the email address {email}.
      </p>
      <p>
        Click{' '}
        <a
          href={`${process.env.NEXT_PUBLIC_URL}/reset?userId=${hashedUserId}`}
          target='blank'
        >
          here
        </a>{' '}
        to reset your password.
      </p>
      <p>
        <strong>This link will expire in 5 minutes.</strong>
      </p>
    </div>
  );
};

export default UserRequestPasswordResetEmail;
