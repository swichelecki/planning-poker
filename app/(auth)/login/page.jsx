import connectDB from '../../../config/db';
import User from '../../../models/User';
import { Login } from '../../../components';
import { getUserFromCookie } from '../../../utilities/getUserFromCookie';

export const metadata = {
  title: 'Log In',
};

export const dynamic = 'force-dynamic';

async function getUser() {
  try {
    await connectDB();

    const { userId } = await getUserFromCookie();

    if (!userId) return;

    const userRaw = await User.findOne({ _id: userId });
    const user = JSON.parse(JSON.stringify(userRaw));

    return user;
  } catch (error) {
    console.error(error);
  }
}

export default async function LoginPage() {
  const user = await getUser();

  return <Login user={user ?? {}} />;
}
