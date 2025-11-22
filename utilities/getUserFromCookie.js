'server-only';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { handleServerError } from './';
const jwtSecret = process.env.JWT_SECRET;

export const getUserFromCookie = async () => {
  const token = (await cookies()).get('planning_poker');
  let user = false;
  let userId;
  let isAdmin;

  if (!token?.value) return { user };

  try {
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(jwtSecret)
    );

    if (payload.hasToken) {
      user = true;
      userId = payload?.id;
      isAdmin = payload?.isAdmin;
    }
  } catch (error) {
    const errorMessage = handleServerError(error);
    console.error(errorMessage);
  }

  return {
    user,
    userId,
    isAdmin,
  };
};
