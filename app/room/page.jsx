import { Room } from '../../components';
import { getUserFromCookie } from '../../utilities';

export const metadata = {
  title: 'Room',
};

export const dynamic = 'force-dynamic';

export default async function RoomPage() {
  const { userId, isAdmin } = await getUserFromCookie();

  const user = { userId, isAdmin };

  return <Room user={user ?? {}} />;
}
