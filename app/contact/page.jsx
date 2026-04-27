import { getUserFromCookie } from '../../utilities';
import { Contact } from '../../components';

export const metadata = {
  title: 'Contact',
};

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const { userId } = await getUserFromCookie();

  return <Contact userId={userId} />;
}
