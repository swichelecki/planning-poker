const UserInvitationEmail = ({
  firstName,
  lastName,
  team,
  roomNameUnique,
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
          href={encodeURI(
            userExists
              ? `${process.env.NEXT_PUBLIC_URL}/login?username=${userExists?.firstName}+${userExists?.lastName}&room=${roomNameUnique}`
              : `${process.env.NEXT_PUBLIC_URL}/invitation?room=${roomNameUnique}&email=${email}`,
          )}
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
