const UserInvitationEmail = ({
  firstName,
  lastName,
  team,
  encodedRoomInfo,
  email,
  userExists,
}) => {
  return (
    <div>
      <p>
        You have been invited by {firstName} {lastName} to join {team} at Agile
        Story Planning Poker.
      </p>
      <p>
        Click{' '}
        <a
          href={
            userExists
              ? `${process.env.NEXT_PUBLIC_URL}/login?room=${encodedRoomInfo}`
              : `${process.env.NEXT_PUBLIC_URL}/invitation?room=${encodedRoomInfo}&email=${email}`
          }
          target='blank'
          aria-label='Click to create your Planning Poker account'
        >
          here
        </a>{' '}
        to create your account.
      </p>
    </div>
  );
};

export default UserInvitationEmail;
