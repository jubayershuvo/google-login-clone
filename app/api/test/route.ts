import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

export async function GET(request: NextRequest) {
    const ua = request.headers.get("user-agent") || "";

    const parser = new UAParser(ua);
    const result = parser.getResult();

    return NextResponse.json({
        userAgent: ua,
        browser: result.browser.name,
        browserVersion: result.browser.version,
        os: result.os.name,
        osVersion: result.os.version,
        device: result.device.type || "desktop",
    });
}



