'use server';

import connectDB from '../../config/db';
import User from '../../models/User';
import { handleServerError, getUserFromCookie } from '../../utilities';
import { Resend } from 'resend';
import { UserInvitationEmail } from '../../components';
import { createRoomSchema } from '../../schemas/schemas';
const resendApiKey = process.env.RESEND_API_KEY;

export default async function createRoom(formData) {
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
  const zodValidationResults = createRoomSchema.safeParse(formData);

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

    const { userId, team, teammates } = zodData;

    const user = await User.findOne({ _id: userId });

    if (!user) return { status: 404 };

    const objectId = user._id;
    const stringId = objectId.toString();
    const teamFormatted = team.replace(/ /g, '_');
    const roomNameUnique = `${teamFormatted}_${stringId}`;

    const room = {
      roomName: team,
      roomNameUnique,
    };

    await User.updateOne(
      {
        _id: user._id,
      },
      {
        $push: { rooms: room },
      }
    );

    const firstName = user.firstName;
    const lastName = user.lastName;
    const encodedRoomInfo = encodeURI(roomNameUnique);

    const resend = new Resend(resendApiKey);
    // send invitation emails to teammates
    for (const email of teammates) {
      const { error } = await resend.emails.send({
        from: 'Planning Poker <onboarding@resend.dev>',
        // TODO: take out my email
        to: 'swichelecki@gmail.com',
        //to: email,
        //to: 'onboarding@resend.dev',
        subject: `${firstName} ${lastName} Has Invited You to Join Planning Poker`,
        react: UserInvitationEmail({
          firstName,
          lastName,
          team,
          encodedRoomInfo,
        }),
      });

      if (error) console.error('Resend error: ', error);
    }

    return { status: 200, roomNameUnique };
  } catch (error) {
    const errorMessage = handleServerError(error);
    console.error(errorMessage);
    return { status: 500, error: errorMessage };
  }
}
