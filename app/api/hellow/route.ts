import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {email , password} = await req.json()
        
        /// if body is empty
        if(!email|| !password){
            return NextResponse.json({error:"Bad request"},{status: 400})
        }

        const exist = await User.findOne({email})
        /// if existed 
        if(exist){
            return NextResponse.json({error: "user already exist"},{status: 409})
        }

        // saving the user to the db
        const user  = new User({email, password})
        await user.save()

        const AccessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        /// 



    } catch (error) {
        
    }
    
}