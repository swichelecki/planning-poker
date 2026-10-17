'use server';

import { headers } from 'next/headers';
import { handleServerError } from '../../utilities';
import { Resend } from 'resend';
import { RoomCreatedEmail } from '../../components';
import { createRoomEmailSchema } from '../../schemas/schemas';
const resendApiKey = process.env.RESEND_API_KEY;
const supportEmail = process.env.SUPPORT_EMAIL;

export default async function createRoom(username, room) {
  if (!username || !room) {
    return {
      status: 400,
      error: 'Bad Request',
    };
  }

  // If localhost don't send email
  const headerList = await headers();
  let ipAddress = headerList.get('x-forwarded-for')?.split(',')[0];
  if (!ipAddress) ipAddress = headerList.get('x-real-ip') || 'unknown';
  if (ipAddress === '::1' || ipAddress === '::ffff:127.0.0.1') return;

  // check that data shape is correct
  const zodValidationResults = createRoomEmailSchema.safeParse({
    username,
    room,
  });

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
    const { username, room } = zodData;

    const resend = new Resend(resendApiKey);

    const error = await resend.emails.send({
      from: 'Express Planning Poker <support@agilestoryplanningpoker.com>',
      to: supportEmail,
      subject: 'Express Planning Poker Room Created',
      react: RoomCreatedEmail({
        username,
        room,
      }),
    });

    if (error) console.error('Resend error: ', error);

    return { status: 200 };
  } catch (error) {
    const errorMessage = handleServerError(error);
    console.error(errorMessage);
    return { status: 500, error: errorMessage };
  }
}
