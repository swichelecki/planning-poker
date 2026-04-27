import { Suspense } from 'react';
import { getUserFromCookie } from '../../utilities';
import { Contact } from '../../components';

export const metadata = {
  title: 'Contact',
};

async function ContactWithData() {
  const { userId } = await getUserFromCookie();

  return <Contact userId={userId} />;
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactWithData />
    </Suspense>
  );
}
