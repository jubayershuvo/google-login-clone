
import { Suspense } from "react";
import { connection } from "next/server";

import NotFound from "@/components/NotFound";
import GoogleSignInFlow from "@/components/Signin";
import connectDB from "@/lib/mongodb";
import Link from "@/models/Link";

export default function SignInPage({
    params,
}: {
    params: Promise<{ name: string }>;
}) {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                </div>
            }
        >
            <SignInContent params={params} />
        </Suspense>
    );
}

async function SignInContent({
    params,
}: {
    params: Promise<{ name: string }>;
}) {
    // Switch to request-time rendering before Mongoose runs.
    await connection();

    const { name } = await params;

    await connectDB();

    const link = await Link.findOne({ name }).lean();

    if (!link) {
        return <NotFound />;
    }

    return <GoogleSignInFlow />;
}
