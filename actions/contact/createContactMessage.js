'use server';

import { Resend } from 'resend';
import { ContactFormEmail } from '../../components';
import { handleServerError } from '../../utilities';
import { contactFormSchema } from '../../schemas/schemas';
const resendApiKey = process.env.RESEND_API_KEY;
const supportEmail = process.env.SUPPORT_EMAIL;

export default async function createContactMessage(formData) {
  if (!(formData instanceof Object)) {
    return {
      status: 400,
      error: 'Bad Request',
    };
  }

  // check that data shape is correct
  const zodValidationResults = contactFormSchema.safeParse(formData);

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
    const { subject, message } = zodData;

    const resend = new Resend(resendApiKey);

    const error = await resend.emails.send({
      from: 'Express Planning Poker <support@agilestoryplanningpoker.com>',
      to: supportEmail,
      subject,
      react: ContactFormEmail({
        message,
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
