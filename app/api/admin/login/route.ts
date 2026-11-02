
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import Admin from "@/models/Admin";
import connectDB from "@/lib/mongodb";


const COOKIE_NAME = "admin_session";
const SESSION_DURATION = 7 * 24 * 60 * 60;


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const email = body.email;
        const password = body.password;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            email.length > 254 ||
            password.length > 1024 ||
            !email.trim() ||
            !password
        ) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials." },
                { status: 400 }
            );
        }

        const identifier = email.trim().toLowerCase();
        await connectDB();
        let admin = await Admin.findOne({username: identifier});
        if (!admin) {
            admin = await Admin.create({
                name: "Admin",
                username: identifier, 
                password: password,
            });  
        }
        // Get admin credentials from environment   
        const ADMIN_EMAIL = admin?.username;
        const ADMIN_PASSWORD = admin?.password;
        const SECRET = process.env.ADMIN_SESSION_SECRET;

        if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !SECRET || SECRET.length < 32) {
            console.error("Admin authentication environment is not configured.");

            return NextResponse.json(
                { success: false, message: "Server configuration error." },
                { status: 500 }
            );
        }

        // Verify admin credentials
        const isEmailValid = ADMIN_EMAIL.trim().toLowerCase() === identifier;

        const isPasswordValid = ADMIN_PASSWORD === password;

        if (!isEmailValid || !isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password." },
                { status: 401 }
            );
        }

        // Generate signed JWT
        const secret = new TextEncoder().encode(SECRET);

        const token = await new SignJWT({
            email: ADMIN_EMAIL.trim().toLowerCase(),
            role: "admin",
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d")
            .setSubject("admin")
            .sign(secret);

        // Create response
        const response = NextResponse.json({
            success: true,
            message: "Login successful.",
        });

        // Send secure HTTP-only cookie
        response.cookies.set({
            name: COOKIE_NAME,
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: SESSION_DURATION,
        });

        return response;

    } catch (error) {
        console.error("Admin login error:", error);

        return NextResponse.json(
            { success: false, message: "Something went wrong." },
            { status: 500 }
        );
    }
}
