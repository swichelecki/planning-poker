import Link from 'next/link';
import { Suspense } from 'react';
import PlayingCards from '../shared/PlayingCards';
import UserOptions from './UserOptions';

const Header = () => {
  return (
    <header className='header'>
      <div className='header__inner-wrapper'>
        <Link href='/' prefetch={false}>
          <PlayingCards />
          <span>Agile Story Planning Poker</span>
        </Link>
        <Suspense>
          <UserOptions />
        </Suspense>
      </div>
    </header>
  );
};

export default Header;
