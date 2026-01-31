import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    rooms: [{ roomName: { type: String }, roomNameUnique: { type: String } }],
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    twoFactorAuthCode: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

const User = models.User ?? model('User', UserSchema);

export default User;
