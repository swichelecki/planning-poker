import { Suspense } from 'react';
import { CreateRoom } from '../../components';

export const metadata = {
  title: 'Create Room',
};

export default function CreateRoomPage() {
  return (
    <Suspense>
      <CreateRoom />
    </Suspense>
  );
}
