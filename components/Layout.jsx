'use client';

import { useAppContext } from '../context';
import { useScrollToTop } from '../hooks';
import { Header } from '../components';

const Layout = ({ children }) => {
  const { modal, toast } = useAppContext();

  useScrollToTop();

  return (
    <>
      <Header />
      <main className='container'>{children}</main>
      {modal && modal}
      {toast && toast}
    </>
  );
};

export default Layout;
