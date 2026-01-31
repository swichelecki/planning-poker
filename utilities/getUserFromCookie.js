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
  let cookieError = false;

  if (!token?.value) return { user };

  try {
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(jwtSecret),
    );

    if (payload.hasToken) {
      user = true;
      userId = payload?.id;
      isAdmin = payload?.isAdmin;
    }
  } catch (error) {
    if (
      error.code === 'ERR_JWT_EXPIRED' ||
      error.message?.includes('expired')
    ) {
      console.log('JWT token expired - user needs to re-authenticate');
      return { user: false };
    }

    const errorMessage = handleServerError(error);
    console.error(`JWT token error: ${errorMessage}`);
    cookieError = { status: 500, error: errorMessage };
  }

  return {
    user,
    userId,
    isAdmin,
    cookieError,
  };
};
