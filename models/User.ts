import mongoose, { Schema, Document, mongo } from "mongoose";
import jwt from "jsonwebtoken";

interface User extends Document {
  email: string;
  password: string;
}

const UserSchema: Schema<User> = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide the eamil id"],
    },
    password: {
      type: String,
      required: [true, "Please provide the password"],
    },
  },
  {
    timestamps: true,
  }
);

///access token
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      
    },
    process.env.JWT_SECRET as string
  );
};

const User = mongoose.models.User || mongoose.model<User>("User", UserSchema);
export default User;
