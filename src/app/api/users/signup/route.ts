import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import {sendEmail} from "@/helpers/mailer";



export async function POST(request: NextRequest) {
  try {

    await connect();
    const { username, email, password } = await request.json();
    console.log("Received signup data:", username, email, password);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    let salt = await bcryptjs.genSalt(10);
    let hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({ 
        username, 
        email, 
        password: hashedPassword 
    });

    const savedUser = await newUser.save();
    console.log("New user created:", savedUser);

    //send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    return NextResponse.json(
        { 
            message: "User created successfully",
            success: true,
            savedUser
        },
        { status: 201 },
    );

  } catch (error: any) {

    console.error("Error during signup:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
    
  }
}