import { z } from 'zod';
import {
  MISSING_NAME,
  MISSING_EMAIL,
  MISSING_PASSWORD,
  MISSING_CONFIRM_PASSWORD,
  INVALID_EMAIL,
  PASSWORD_MISMATCH,
  CHARACTER_LIMIT_50,
  TWO_FACTOR_CODE_LIMIT,
  MISSING_TEAM_NAME,
  MISSING_TEAMMATES,
  TEAMMATES_LIMIT,
} from '../constants';

export const createUserSchema = z
  .object({
    firstName: z.string().min(1, MISSING_NAME).max(50, CHARACTER_LIMIT_50),
    lastName: z.string().min(1, MISSING_NAME).max(50, CHARACTER_LIMIT_50),
    email: z
      .string()
      .min(1, MISSING_EMAIL)
      .email(INVALID_EMAIL)
      .max(50, CHARACTER_LIMIT_50),
    password: z.string().min(1, MISSING_PASSWORD).max(50, CHARACTER_LIMIT_50),
    confirmPassword: z
      .string()
      .min(1, MISSING_CONFIRM_PASSWORD)
      .max(50, CHARACTER_LIMIT_50),
    verification: z.string().max(6, TWO_FACTOR_CODE_LIMIT).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });

export const emailAddressSchema = z.object({
  email: z
    .string()
    .min(1, MISSING_EMAIL)
    .email(INVALID_EMAIL)
    .max(50, CHARACTER_LIMIT_50),
});

export const createRoomSchema = z.object({
  userId: z.string(),
  team: z.string().min(1, MISSING_TEAM_NAME).max(50, CHARACTER_LIMIT_50),
  teammates: z
    .array(z.string())
    .min(1, MISSING_TEAMMATES)
    .max(20, TEAMMATES_LIMIT),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, MISSING_EMAIL)
    .email(INVALID_EMAIL)
    .max(50, CHARACTER_LIMIT_50),
  password: z.string().min(1, MISSING_PASSWORD).max(50, CHARACTER_LIMIT_50),
  verification: z.string().max(6, TWO_FACTOR_CODE_LIMIT).optional(),
});

/*
export const requestPasswordResetSchema = z.object({
  email: z
    .string()
    .min(1, MISSING_EMAIL)
    .email(INVALID_EMAIL)
    .max(50, CHARACTER_LIMIT_50),
});

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, MISSING_EMAIL)
      .email(INVALID_EMAIL)
      .max(50, CHARACTER_LIMIT_50),
    password: z
      .string()
      .min(1, MISSING_PASSWORD)
      .max(50, CHARACTER_LIMIT_50),
    confirmPassword: z
      .string()
      .min(1, MISSING_CONFIRM_PASSWORD)
      .max(50, CHARACTER_LIMIT_50),
    userId: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });


export const contactFormSchema = z
  .object({
    userId: z.string(),
    subject: z
      .string()
      .min(1, MISSING_SUBJECT)
      .max(50, CHARACTER_LIMIT_50),
    message: z
      .string()
      .min(1, MISSING_MESSAGE)
      .max(5000, CHARACTER_LIMIT_5000),
  })
  .refine(
    (data) => data.message?.length > 0 && data.message !== '<p><br></p>',
    {
      message: MISSING_MESSAGE,
      path: ['message'],
    }
  );

export const changePasswordSchema = z
  .object({
    userId: z.string(),
    email: z
      .string()
      .min(1, MISSING_EMAIL)
      .email(INVALID_EMAIL)
      .max(50, CHARACTER_LIMIT_50),
    password: z
      .string()
      .min(1, MISSING_PASSWORD)
      .max(50, CHARACTER_LIMIT_50),
    newPassword: z
      .string()
      .min(1, MISSING_NEW_PASSWORD)
      .max(50, CHARACTER_LIMIT_50),
    confirmNewPassword: z
      .string()
      .min(1, MISSING_NEW_CONFIRM_PASSWORD)
      .max(50, CHARACTER_LIMIT_50),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        message: PASSWORD_MISMATCH,
        path: ['newPassword'],
      });
      ctx.addIssue({
        message: PASSWORD_MISMATCH,
        path: ['confirmNewPassword'],
      });
    }
  });

export const deleteAccountSchema = z
  .object({
    userId: z.string(),
    deleteEmail: z
      .string()
      .min(1, MISSING_EMAIL)
      .email(INVALID_EMAIL)
      .max(50, CHARACTER_LIMIT_50),
    deletePassword: z
      .string()
      .min(1, MISSING_PASSWORD)
      .max(50, CHARACTER_LIMIT_50),
    deleteConfirmation: z
      .string()
      .min(1, MISSING_DELETE_CONFIRMATION)
      .max(50, CHARACTER_LIMIT_50),
  })
  .refine(
    (data) => data.deleteConfirmation.toLowerCase() === DELETE_MY_ACCOUNT,
    {
      message: MISSING_DELETE_MISMATCH,
      path: ['deleteConfirmation'],
    }
  );

export const adminDeleteUserSchema = z.object({
  password: z
    .string()
    .min(1, MISSING_PASSWORD)
    .max(50, CHARACTER_LIMIT_50),
}); */
