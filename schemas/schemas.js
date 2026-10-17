import { z } from 'zod';
import {
  MISSING_FIRST_NAME,
  MISSING_LAST_NAME,
  CHARACTER_LIMIT_50,
  INVALID_URL,
  MISSING_URL,
  CHARACTER_LIMIT_5000,
  MISSING_SUBJECT,
  MISSING_MESSAGE,
} from '../constants';

export const createRoomSchema = z.object({
  firstName: z.string().min(2, MISSING_FIRST_NAME).max(50, CHARACTER_LIMIT_50),
  lastName: z.string().min(2, MISSING_LAST_NAME).max(50, CHARACTER_LIMIT_50),
});

export const storyLinkSchema = z.object({
  storyLink: z.url(MISSING_URL).min(1).max(100, INVALID_URL),
});

export const createRoomEmailSchema = z.object({
  username: z.string().min(2).max(50, CHARACTER_LIMIT_50),
  room: z.string().min(2).max(50, CHARACTER_LIMIT_50),
});

export const contactFormSchema = z.object({
  subject: z.string().min(1, MISSING_SUBJECT).max(50, CHARACTER_LIMIT_50),
  message: z.string().min(1, MISSING_MESSAGE).max(5000, CHARACTER_LIMIT_5000),
});
