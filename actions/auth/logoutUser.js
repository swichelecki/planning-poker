'use server';

import { cookies } from 'next/headers';
import { handleServerError } from '../../utilities';

export default async function logoutUser() {
  try {
    (await cookies()).delete('planning_poker');
    return { status: 200 };
  } catch (error) {
    console.error(error);
    const errorMessage = handleServerError(error);
    return { status: 500, error: errorMessage };
  }
}
