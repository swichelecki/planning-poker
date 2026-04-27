import { Suspense } from 'react';
import { getUserFromCookie } from '../../../utilities';
import { Account } from '../../../components';

export const metadata = {
  title: 'Account',
};

async function AccountWithData() {
  const { userId } = await getUserFromCookie();

  return <Account userId={userId} />;
}

export default function AccountPage() {
  return (
    <Suspense>
      <AccountWithData />
    </Suspense>
  );
}
