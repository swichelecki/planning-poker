const UserInvitationEmail = ({
  firstName,
  lastName,
  team,
  roomNameUnique,
  email,
  userExists,
}) => {
  const roomName = encodeURIComponent(roomNameUnique) ?? '';
  const inviteEmail = encodeURIComponent(email) ?? '';
  const userName =
    encodeURIComponent(`${userExists?.firstName}+${userExists?.lastName}`) ??
    '';

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
              ? `${process.env.NEXT_PUBLIC_URL}/login?username=${userName}&room=${roomName}`
              : `${process.env.NEXT_PUBLIC_URL}/invitation?room=${roomName}&email=${inviteEmail}`
          }
          target='blank'
          aria-label={`Click to join ${team} at Agile Story Planning Poker`}
        >
          here
        </a>{' '}
        join {team} at Agile Story Planning Poker.
      </p>
    </div>
  );
};

export default UserInvitationEmail;
