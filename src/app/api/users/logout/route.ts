import {connect} from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    try {

        await connect();

        const response = NextResponse.json(
            { message: "Logout successful" },
            { status: 200 }
        );

        response.cookies.set("token","",{
            httpOnly: true,
            expires: new Date(0) // Set the cookie to expire in the past
        });

        return response;

    } catch (error: any) {
        console.error("Error during logout:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
        
    }
}