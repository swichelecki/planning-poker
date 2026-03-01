'use server';

import connectDB from '../../config/db';
import User from '../../models/User';
import { Resend } from 'resend';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { handleServerError, getUserFromCookie } from '../../utilities';
import { deleteAccountSchema } from '../../schemas/schemas';
import { UserDeletedEmail } from '../../components';
const resendApiKey = process.env.RESEND_API_KEY;
const supportEmail = process.env.SUPPORT_EMAIL;

export default async function deleteUserAccount(formData) {
  if (!(formData instanceof Object)) {
    return {
      status: 400,
      error: 'Bad Request',
    };
  }

  // check that cookie user id matches FormData user id
  const { userId: cookieUserId, cookieError } = await getUserFromCookie();
  if (cookieError) return cookieError;

  const { userId } = formData;
  if (!userId || userId !== cookieUserId) {
    return {
      status: 400,
      error: 'Unauthorized',
    };
  }

  // check that data shape is correct
  const zodValidationResults = deleteAccountSchema.safeParse(formData);

  const {
    data: zodData,
    success,
    error: zodValidationError,
  } = zodValidationResults;
  if (!success) {
    console.error(zodValidationError);
    return {
      status: 400,
      error: 'Zod validation failed. Check server console.',
    };
  }

  try {
    await connectDB();
    const { userId, deleteEmail: email, deletePassword: password } = zodData;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      await User.deleteOne({ _id: userId });
      (await cookies()).delete('planning_poker');

      // send user deleted email
      const resend = new Resend(resendApiKey);

      const { error } = await resend.emails.send({
        from: 'Planning Poker <support@agilestoryplanningpoker.com>',
        to: supportEmail,
        subject: 'Agile Story Planning Poker User Account Deleted',
        react: UserDeletedEmail({
          email,
          createdAt: user.createdAt.toString(),
        }),
      });

      if (error) console.error('Resend error: ', error);

      return { status: 200 };
    }

    return { status: 403 };
  } catch (error) {
    const errorMessage = handleServerError(error);
    console.error(errorMessage);
    return { status: 500, error: errorMessage };
  }
}
