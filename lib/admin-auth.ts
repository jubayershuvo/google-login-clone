import { cookies } from "next/headers";
import { jwtVerify, errors } from "jose";

const COOKIE_NAME = "admin_session";

export type AdminSessionStatus =
  | "valid"
  | "expired"
  | "invalid"
  | "missing";

export async function getAdminSessionStatus(): Promise<AdminSessionStatus> {
  try {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    const secret = process.env.ADMIN_SESSION_SECRET;

    if (!token) return "missing";

    if (!secret || secret.length < 32) {
      return "invalid";
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      {
        algorithms: ["HS256"],
        subject: "admin",
      }
    );

    if (payload.role !== "admin") {
      return "invalid";
    }

    return "valid";
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      return "expired";
    }

    return "invalid";
  }
}

export async function verifyAdmin(): Promise<boolean> {
  return (await getAdminSessionStatus()) === "valid";
}