import connectDB from '../../../config/db';
import User from '../../../models/User';
import { Login } from '../../../components';
import { getUserFromCookie, handleServerError } from '../../../utilities';

export const metadata = {
  title: 'Log In',
};

export const dynamic = 'force-dynamic';

async function getUser() {
  try {
    const { userId } = await getUserFromCookie();

    if (!userId) return;
    await connectDB();
    const userRaw = await User.findOne({ _id: userId });
    const user = JSON.parse(JSON.stringify(userRaw));

    return user;
  } catch (error) {
    const errorMessage = handleServerError(error);
    console.error(errorMessage);
  }
}

export default async function LoginPage() {
  const user = await getUser();

  return <Login user={user ?? {}} />;
}
