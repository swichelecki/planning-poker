'use client';

import Link from 'next/link';
import CTA from '../shared/CTA';
import PlayingCards from '../shared/PlayingCards';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className='header'>
      <div className='header__inner-wrapper'>
        <Link href='/'>
          <PlayingCards />
          <span>Express Planning Poker</span>
        </Link>
        <div className='header__content-right'>
          {pathname === '/' && (
            <CTA
              text='Plan Now'
              type='anchor'
              href='/enter'
              className='cta-text-link cta-text-link--purple'
              ariaLabel='Get started with Express Planning Poker'
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
