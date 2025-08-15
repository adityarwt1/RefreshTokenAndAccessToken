import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "./lib/mongodb";
import User from "./models/User";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    const url = new URL("/signin", req.url);
    return NextResponse.redirect(url);
  }
  const decodedAccessToken = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as { _id: string };

  if (!decodedAccessToken) {
    const url = new URL("/signin", req.url);
    return NextResponse.redirect(url);
  }
  await connectDB();
  const user = await User.findOne({ _id: decodedAccessToken._id });
  await mongoose.disconnect();
  const decodedRefreshToken = jwt.verify(
    user.refreshToken,
    process.env.JWT_SECRET as string
  );
  if (decodedAccessToken !== decodedRefreshToken) {
    const url = new URL("/signin", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
