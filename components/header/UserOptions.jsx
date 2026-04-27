import UserMenu from './UserMenu';
import CTA from '../shared/CTA';
import { getUserFromCookie } from '../../utilities';

const UserOptions = async () => {
  const { userId, isAdmin } = await getUserFromCookie();

  return (
    <div className='header__content-right'>
      {userId ? (
        <UserMenu userId={userId} isAdmin={isAdmin} />
      ) : (
        <CTA
          text='Log In'
          type='anchor'
          href='/login'
          className='cta-text-link'
          ariaLabel='Log in to Agile Story Planning Poker'
        />
      )}
    </div>
  );
};

export default UserOptions;
