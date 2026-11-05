import NotFound from "@/components/NotFound";
import GoogleSignInFlow from "@/components/Signin";
import connectDB from "@/lib/mongodb";
import Link from "@/models/Link";




export default async function SignInContent({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  await connectDB();

  const link = await Link.findOne({ name });

  if (!link) {
    return <NotFound />;
  }

  return <GoogleSignInFlow />;
}
