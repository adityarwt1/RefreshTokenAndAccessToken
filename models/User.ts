import mongoose, { Schema, Document, mongo } from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto"
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
    process.env.JWT_SECRET as string,{
      expiresIn: "1d"
    }
  );
};

/// refresh token 
UserSchema.methods.generateRefreshToken = function(){
  return jwt.sign({
    _id: this._id,
 },
  process.env.JWT_SECRET as string,{
    expiresIn:"10d"
  })
  }


/// generate temporary
UserSchema.methods.generateTemporaryToken = function(){
  const unHanshedToken = crypto.randomBytes(20).toString()
  const hashedToken = crypto
          .createHash("sha256")
          .update(unHanshedToken)
          .digest("hex")
  const tokenExpiry = Date.now() + (10*60*1000) // 10 minute
  return {unHanshedToken, hashedToken, tokenExpiry}
}

const User = mongoose.models.User || mongoose.model<User>("User", UserSchema);
export default User;
