'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { socket } from '../../lib/socketClient';
import { useAppContext } from '../../context';
import { PlayingCards } from '../../components';
const UserMenu = dynamic(() => import('../../components/header/UserMenu'));
const CTA = dynamic(() => import('../../components/shared/CTA'));

const Header = () => {
  const { userId, isAdmin } = useAppContext();
  const pathname = usePathname();

  return (
    <header className='header'>
      <div className='header__inner-wrapper'>
        <Link
          href='/'
          prefetch={false}
          onClick={() => {
            if (!userId) return;
            socket.disconnect();
          }}
        >
          <PlayingCards />
          <span>Agile Story Planning Poker</span>
        </Link>
        <div className='header__content-right'>
          {userId ? (
            <UserMenu isAdmin={isAdmin} />
          ) : pathname === '/' ? (
            <>
              <CTA
                text='Log In'
                type='anchor'
                href='/login'
                className='cta-text-link'
                ariaLabel='Log in to Agile Story Planning Poker'
              />
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
