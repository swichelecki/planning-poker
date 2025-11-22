'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useAppContext } from '../../context';
//const UserMenu = dynamic(() => import('../../components/header/UserMenu'));
const CTA = dynamic(() => import('../../components/shared/CTA'));

const Header = () => {
  const { userId, isAdmin } = useAppContext();
  const pathname = usePathname();

  return (
    <header className='header'>
      <div className='header__inner-wrapper'>
        <Link href='/login' prefetch={false} className='h1'>
          Agile Story Planning Poker
        </Link>
        <div className='header__content-right'>
          {userId ? (
            <>{/* <UserMenu isAdmin={isAdmin} /> */}</>
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
