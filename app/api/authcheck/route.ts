import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";
export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    console.log(token);

    if (!token) {
      return NextResponse.json({ error: "unotherized" }, { status: 401 });
    }
    const decodedAccessToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { _id: string; email: string };

    if (!decodedAccessToken) {
      return NextResponse.json({ error: "unotherized" }, { status: 401 });
    }
    const email = decodedAccessToken?.email;
    console.log("decoded accesstokem", decodedAccessToken._id);
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log("user from the database", user);
    await mongoose.disconnect();
    const decodedRefreshToken = jwt.verify(
      user.refreshToken,
      process.env.JWT_SECRET as string
    );
    console.log(
      "decoded refresh token",
      decodedRefreshToken,
      "decoded access token",
      decodedAccessToken
    );

    return NextResponse.json(
      { message: "user authenticated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
