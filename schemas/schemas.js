import { z } from 'zod';
import {
  FORM_ERROR_MISSING_NAME,
  FORM_ERROR_MISSING_EMAIL,
  FORM_ERROR_MISSING_PASSWORD,
  FORM_ERROR_MISSING_CONFIRM_PASSWORD,
  FORM_ERROR_MISSING_NEW_PASSWORD,
  FORM_ERROR_MISSING_NEW_CONFIRM_PASSWORD,
  FORM_ERROR_MISSING_DELETE_CONFIRMATION,
  FORM_ERROR_MISSING_DELETE_MISMATCH,
  FORM_ERROR_INVALID_EMAIL,
  FORM_ERROR_PASSWORD_MISMATCH,
  FORM_CHARACTER_LIMIT_50,
  FORM_ERROR_2FACTOR_CODE_LIMIT,
} from '../constants';

export const createUserSchema = z
  .object({
    name: z
      .string()
      .min(1, FORM_ERROR_MISSING_NAME)
      .max(50, FORM_CHARACTER_LIMIT_50),
    email: z
      .string()
      .min(1, FORM_ERROR_MISSING_EMAIL)
      .email(FORM_ERROR_INVALID_EMAIL)
      .max(50, FORM_CHARACTER_LIMIT_50),
    password: z
      .string()
      .min(1, FORM_ERROR_MISSING_PASSWORD)
      .max(50, FORM_CHARACTER_LIMIT_50),
    confirmPassword: z
      .string()
      .min(1, FORM_ERROR_MISSING_CONFIRM_PASSWORD)
      .max(50, FORM_CHARACTER_LIMIT_50),
    verification: z.string().max(6, FORM_ERROR_2FACTOR_CODE_LIMIT).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: FORM_ERROR_PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, FORM_ERROR_MISSING_EMAIL)
    .email(FORM_ERROR_INVALID_EMAIL)
    .max(50, FORM_CHARACTER_LIMIT_50),
  password: z
    .string()
    .min(1, FORM_ERROR_MISSING_PASSWORD)
    .max(50, FORM_CHARACTER_LIMIT_50),
  verification: z.string().max(6, FORM_ERROR_2FACTOR_CODE_LIMIT).optional(),
});

/*
export const requestPasswordResetSchema = z.object({
  email: z
    .string()
    .min(1, FORM_ERROR_MISSING_EMAIL)
    .email(FORM_ERROR_INVALID_EMAIL)
    .max(50, FORM_CHARACTER_LIMIT_50),
});

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, FORM_ERROR_MISSING_EMAIL)
      .email(FORM_ERROR_INVALID_EMAIL)
      .max(50, FORM_CHARACTER_LIMIT_50),
    password: z
      .string()
      .min(1, FORM_ERROR_MISSING_PASSWORD)
      .max(50, FORM_CHARACTER_LIMIT_50),
    confirmPassword: z
      .string()
      .min(1, FORM_ERROR_MISSING_CONFIRM_PASSWORD)
      .max(50, FORM_CHARACTER_LIMIT_50),
    userId: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: FORM_ERROR_PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });


export const contactFormSchema = z
  .object({
    userId: z.string(),
    subject: z
      .string()
      .min(1, FORM_ERROR_MISSING_SUBJECT)
      .max(50, FORM_CHARACTER_LIMIT_50),
    message: z
      .string()
      .min(1, FORM_ERROR_MISSING_MESSAGE)
      .max(5000, FORM_CHARACTER_LIMIT_5000),
  })
  .refine(
    (data) => data.message?.length > 0 && data.message !== '<p><br></p>',
    {
      message: FORM_ERROR_MISSING_MESSAGE,
      path: ['message'],
    }
  );

export const changePasswordSchema = z
  .object({
    userId: z.string(),
    email: z
      .string()
      .min(1, FORM_ERROR_MISSING_EMAIL)
      .email(FORM_ERROR_INVALID_EMAIL)
      .max(50, FORM_CHARACTER_LIMIT_50),
    password: z
      .string()
      .min(1, FORM_ERROR_MISSING_PASSWORD)
      .max(50, FORM_CHARACTER_LIMIT_50),
    newPassword: z
      .string()
      .min(1, FORM_ERROR_MISSING_NEW_PASSWORD)
      .max(50, FORM_CHARACTER_LIMIT_50),
    confirmNewPassword: z
      .string()
      .min(1, FORM_ERROR_MISSING_NEW_CONFIRM_PASSWORD)
      .max(50, FORM_CHARACTER_LIMIT_50),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        message: FORM_ERROR_PASSWORD_MISMATCH,
        path: ['newPassword'],
      });
      ctx.addIssue({
        message: FORM_ERROR_PASSWORD_MISMATCH,
        path: ['confirmNewPassword'],
      });
    }
  });

export const deleteAccountSchema = z
  .object({
    userId: z.string(),
    deleteEmail: z
      .string()
      .min(1, FORM_ERROR_MISSING_EMAIL)
      .email(FORM_ERROR_INVALID_EMAIL)
      .max(50, FORM_CHARACTER_LIMIT_50),
    deletePassword: z
      .string()
      .min(1, FORM_ERROR_MISSING_PASSWORD)
      .max(50, FORM_CHARACTER_LIMIT_50),
    deleteConfirmation: z
      .string()
      .min(1, FORM_ERROR_MISSING_DELETE_CONFIRMATION)
      .max(50, FORM_CHARACTER_LIMIT_50),
  })
  .refine(
    (data) => data.deleteConfirmation.toLowerCase() === DELETE_MY_ACCOUNT,
    {
      message: FORM_ERROR_MISSING_DELETE_MISMATCH,
      path: ['deleteConfirmation'],
    }
  );

export const adminDeleteUserSchema = z.object({
  password: z
    .string()
    .min(1, FORM_ERROR_MISSING_PASSWORD)
    .max(50, FORM_CHARACTER_LIMIT_50),
}); */
