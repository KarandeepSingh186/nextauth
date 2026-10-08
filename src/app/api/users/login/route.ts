import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


export async function POST(request: NextRequest) {
    try {

        await connect();
        const { email, password } = await request.json();
        console.log("Received login data:", email, password);

        const user = await User.findOne({ email });
        
        if (!user) {
            return NextResponse.json(
                { message: "User does not exist" },
                { status: 400 }
            );
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 400 }
            );
        }

        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username,
        }

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET as string, { expiresIn: "1d" });

        const response = NextResponse.json(
            { 
                message: "Login successful",
                success: true,
                token
            },
            { status: 200 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
        });
        
        return response;


    } catch (error: any) {
        console.error("Error during login:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}