const UserInvitationEmail = ({
  firstName,
  lastName,
  team,
  encodedRoomInfo,
}) => {
  return (
    <div>
      <p>
        You have been invited by {firstName} {lastName} to join {team} at
        Planning Poker.
      </p>
      <p>
        Click{' '}
        <a
          href={`${process.env.NEXT_PUBLIC_URL}/invitation?room=${encodedRoomInfo}`}
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
