'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '../../context';
import { logoutUser } from '../../actions';
import { Toast } from '../../components';
import { FaUser } from 'react-icons/fa';
import {
  MdOutlineLogout,
  MdManageAccounts,
  MdMessage,
  MdAdminPanelSettings,
} from 'react-icons/md';
import { TbPlayCard2Filled } from 'react-icons/tb';

const UserMenu = ({ isAdmin }) => {
  const menuRef = useRef(null);

  const router = useRouter();

  const { userId, setUserId, setIsAdmin } = useAppContext();

  // close menu when clicking off of it or on it
  useEffect(() => {
    const handleCloseMenuWhenClickingOff = (e) => {
      if (!e.target.classList.contains('user-menu__button')) {
        menuRef?.current?.classList.remove('user-menu__nav--show-menu');
      }
    };

    if (document && typeof document !== 'undefined') {
      document.addEventListener('click', handleCloseMenuWhenClickingOff);

      return () => {
        document.removeEventListener('click', handleCloseMenuWhenClickingOff);
      };
    }
  }, []);

  // show / hide menu
  const handleUserMenu = () => {
    menuRef.current.classList.toggle('user-menu__nav--show-menu');
  };

  // log out
  const handleUserLogOut = async () => {
    const response = await logoutUser();
    if (response.status === 200) {
      setUserId('');
      setIsAdmin(false);
      router.push('/');
    } else {
      setShowToast(<Toast serverError={response} />);
    }
  };

  if (!userId) {
    return <></>;
  }

  return (
    <>
      <button
        onClick={handleUserMenu}
        className='user-menu__button'
        title='User Profile'
      >
        <FaUser />
      </button>
      <nav ref={menuRef} className='user-menu__nav'>
        <ul>
          <li>
            <Link href='/login' prefetch={false}>
              <TbPlayCard2Filled />
              Rooms
            </Link>
          </li>
          <li>
            <Link
              href='/account'
              prefetch={false}
              onClick={() => {
                alert('Coming soon');
              }}
            >
              <MdManageAccounts />
              Account
            </Link>
          </li>
          <li>
            <Link
              href='/contact'
              prefetch={false}
              onClick={() => {
                alert('Coming soon');
              }}
            >
              <MdMessage />
              Contact
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link href='/admin' prefetch={false}>
                <MdAdminPanelSettings />
                Admin
              </Link>
            </li>
          )}
          <li>
            <div role='button' onClick={handleUserLogOut} tabIndex='0'>
              <MdOutlineLogout />
              Log Out
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default UserMenu;
