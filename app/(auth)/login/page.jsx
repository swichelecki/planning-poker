import { Suspense } from 'react';
import connectDB from '../../../config/db';
import User from '../../../models/User';
import { Login } from '../../../components';
import { getUserFromCookie } from '../../../utilities';

export const metadata = {
  title: 'Log In',
};

async function LoginWithData() {
  const { userId } = await getUserFromCookie();

  if (!userId) return <Login user={{}} />;

  await connectDB();
  const userRaw = await User.findOne({ _id: userId });
  const user = JSON.parse(JSON.stringify(userRaw));

  return <Login user={user ?? {}} />;
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginWithData />
    </Suspense>
  );
}
