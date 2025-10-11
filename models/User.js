import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
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
    rooms: {
      type: [String],
      required: true,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    twoFactorAuthCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = models.User ?? model('User', UserSchema);

export default User;
