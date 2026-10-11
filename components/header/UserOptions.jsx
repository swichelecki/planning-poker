import UserMenu from './UserMenu';
import CTA from '../shared/CTA';
import { getUserFromCookie } from '../../utilities';

const UserOptions = async () => {
  const { userId, isAdmin } = await getUserFromCookie();

  return (
    <div className='header__content-right'>
      {/*   {userId ? (
        <UserMenu userId={userId} isAdmin={isAdmin} />
      ) : (
        <CTA
          text='Plan Now'
          type='anchor'
          href='/enter'
          className='cta-text-link cta-text-link--purple'
          ariaLabel='Plan now with Agile Story Planning Poker'
        />
      )} */}
    </div>
  );
};

export default UserOptions;
