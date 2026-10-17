import { Suspense } from 'react';
import { Room } from '../../components';

export const metadata = {
  title: 'Room',
};

export default function RoomPage() {
  return (
    <Suspense>
      <Room />
    </Suspense>
  );
}
