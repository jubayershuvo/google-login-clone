import { NextResponse } from "next/server";
import { getAdminSessionStatus } from "@/lib/admin-auth";


export async function GET() {
  const status = await getAdminSessionStatus();

  return NextResponse.json({
    success: status === "valid",
    authenticated: status === "valid",
    status,
  });
}