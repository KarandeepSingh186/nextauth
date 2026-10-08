import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import {sendEmail} from "@/helpers/mailer";


export async function POST(request: NextRequest) {
  try {

    await connect();
    const { token } = await request.json();
    console.log("Received token for verification:", token);

    const user = await User.findOne({ 
        verifyToken: token,
        verifyTokenExpiry: { $gt: new Date() } // Check if token is not expired
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    console.log("User found for verification:", user);

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully", success: true },
      { status: 200 }
    );

  } catch (error: any) {

    console.error("Error during email verification:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
    
  }
}