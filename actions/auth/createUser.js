'use server';

import connectDB from '../../config/db';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import { handleServerError, getRandom6DigitNumber } from '../../utilities';
import { Resend } from 'resend';
import { UserCreatedEmail, User2FactorAuthEmail } from '../../components';
import { createUserSchema } from '../../schemas/schemas';
const resendApiKey = process.env.RESEND_API_KEY;

export default async function createUser(formData, acceptInvitation) {
  if (!(formData instanceof Object)) {
    return {
      status: 400,
      error: 'Bad Request',
    };
  }

  // check that data shape is correct
  const zodValidationResults = createUserSchema.safeParse(formData);

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

    const { firstName, lastName, email, password } = zodData;
    const { team, teamNameUnique } = formData;

    const userExists = await User.findOne({ email });
    if (userExists) return { status: 409 };

    if ((acceptInvitation && !team) || (acceptInvitation && !teamNameUnique))
      return { status: 400, error: 'Missing room information.' };

    // encrypt 2-factor auth verification code
    const twoFactorAuthCode = getRandom6DigitNumber();
    // TODO: DELETE BELOW LINE
    console.log('Verification code: ', twoFactorAuthCode);
    const twoFactorAuthSalt = await bcrypt.genSalt(10);
    const hashedtwoFactorAuthCode = await bcrypt.hash(
      twoFactorAuthCode.toString(),
      twoFactorAuthSalt
    );

    const passwordSsalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, passwordSsalt);

    const room = acceptInvitation
      ? {
          roomName: team,
          roomNameUnique: teamNameUnique,
        }
      : {};

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      twoFactorAuthCode: hashedtwoFactorAuthCode,
      ...(Object.keys(room).length > 0 && { rooms: room }),
    });

    // send new-user email to admin
    const resend = new Resend(resendApiKey);

    const { error: errorNewUserLogin } = await resend.emails.send({
      from: 'Planning Poker <onboarding@resend.dev>',
      to: 'swichelecki@gmail.com',
      subject: 'Planning Poker User Account Created',
      react: UserCreatedEmail({
        firstName,
        lastName,
        email,
      }),
    });

    if (errorNewUserLogin) console.error('Resend error: ', errorNewUserLogin);

    // send verification code email
    const { error: errorNotifyAdmin } = await resend.emails.send({
      from: 'Planning Poker <onboarding@resend.dev>',
      to: email,
      subject: `Planning Poker Verification Code: ${twoFactorAuthCode}`,
      react: User2FactorAuthEmail({
        twoFactorAuthCode,
      }),
    });

    if (errorNotifyAdmin) console.error('Resend error: ', errorNotifyAdmin);

    return { status: 200, userId: user._id.toString() };
  } catch (error) {
    const errorMessage = handleServerError(error);
    console.error(errorMessage);
    return { status: 500, error: errorMessage };
  }
}
