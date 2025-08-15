import User from "@/models/User";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    /// if body is empty
    if (!email || !password) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const exist = await User.findOne({ email });
    /// if existed
    if (exist) {
      return NextResponse.json(
        { error: "user already exist" },
        { status: 409 }
      );
    }

    // saving the user to the db
    const user = new User({ email, password });
    await user.save();

    const AccessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    /// save the refresh token to the mongodb
    user.refreshToken = refreshToken;
    await user.save();

    (await cookies()).set("token", AccessToken, {
      httpOnly: true,
    });
    return NextResponse.json(
      { message: "signup successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
