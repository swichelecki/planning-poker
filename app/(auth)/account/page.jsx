import { getUserFromCookie } from '../../../utilities';
import { Account } from '../../../components';

export const metadata = {
  title: 'Account',
};

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const { userId, isAdmin } = await getUserFromCookie();

  return <Account userId={userId} isAdmin={isAdmin} />;
}
