import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDataFromToken } from "@/helpers/getDataFromToken";


export async function POST(request: NextRequest) {
    try {

        await connect();

        const userId = getDataFromToken(request)
        const user = await User.findById(userId).select("-password -verifyToken -verifyTokenExpiry"); // Exclude sensitive fields

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { 
                message: "User data retrieved successfully",
                success: true,
                data: user
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Error retrieving user data:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}