import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;

  password: string;

}

const UserSchema: Schema<IUser> = new Schema(
  {

    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  
  },
  {
    timestamps: true,
  }
);
const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
export default User;