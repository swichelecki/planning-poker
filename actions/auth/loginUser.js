'use server';

import connectDB from '../../config/db';
import User from '../../models/User';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { handleServerError } from '../../utilities';
import { loginSchema } from '../../schemas/schemas';
import { VERIFICATION_EXPIRED, VERIFICATION_INCORRECT } from '../../constants';
const jwtSecret = process.env.JWT_SECRET;

export default async function loginUser(formData) {
  if (!(formData instanceof Object)) {
    return {
      status: 400,
      error: 'Bad Request',
    };
  }

  // check that data shape is correct
  const zodValidationResults = loginSchema.safeParse(formData);

  const {
    data: zodData,
    success,
    error: zodValidationError,
  } = zodValidationResults;
  if (!success) {
    console.error(zodValidationError);
    return { status: 400, error: 'Invalid FormData. Check server console.' };
  }

  try {
    await connectDB();

    const { email, password, verification } = zodData;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // check that 5 minutes has not passed after 2-factor auth verification code email sent
      const updatedAtDateObj = new Date(user.updatedAt);
      const updatedAtMsec = updatedAtDateObj.getTime();
      const date = new Date();
      const currentTimeMsc = date.getTime();
      const fiveMinutesMsc = 300000;
      if (currentTimeMsc > updatedAtMsec + fiveMinutesMsc)
        return { status: 410, error: VERIFICATION_EXPIRED };

      // check that 2-factor auth verification code matches
      if (!(await bcrypt.compare(verification, user.twoFactorAuthCode))) {
        return { status: 403, error: VERIFICATION_INCORRECT };
      }

      const token = await new SignJWT({
        hasToken: true,
        id: user._id,
        isAdmin: user.isAdmin,
      })
        .setExpirationTime('1h')
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .sign(new TextEncoder().encode(jwtSecret));
      (await cookies()).set('planning_poker', token);
      return { status: 200, user: JSON.parse(JSON.stringify(user)) };
    }

    return { status: 403 };
  } catch (error) {
    const errorMessage = handleServerError(error);
    console.error(errorMessage);
    return { status: 500, error: errorMessage };
  }
}
