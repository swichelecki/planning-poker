'use server';

import connectDB from '../../config/db';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import { request2FactorAuthentication } from '../../actions';
import { handleServerError } from '../../utilities';
import { Resend } from 'resend';
import { UserCreatedEmail } from '../../components';
import { createUserSchema } from '../../schemas/schemas';
const resendApiKey = process.env.RESEND_API_KEY;
const supportEmail = process.env.SUPPORT_EMAIL;

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
      ...(Object.keys(room).length > 0 && { rooms: room }),
    });

    await request2FactorAuthentication(formData);

    // send new-user email to admin
    const resend = new Resend(resendApiKey);

    const { error: errorNewUserLogin } = await resend.emails.send({
      from: 'Planning Poker <support@agilestoryplanningpoker.com>',
      to: supportEmail,
      subject: 'Agile Story Planning Poker User Account Created',
      react: UserCreatedEmail({
        firstName,
        lastName,
        email,
      }),
    });

    if (errorNewUserLogin) console.error('Resend error: ', errorNewUserLogin);

    return { status: 200, userId: user._id.toString() };
  } catch (error) {
    const errorMessage = handleServerError(error);
    console.error(errorMessage);
    return { status: 500, error: errorMessage };
  }
}
