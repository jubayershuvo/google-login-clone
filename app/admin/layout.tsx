import type { Metadata } from "next";
import AdminLayout from "./layout-r";


export const metadata: Metadata = {
  title: "Admin - Sign in with Google",
  description: "Sign in with your Google account to access the application.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
    <AdminLayout>
      {children}
    </AdminLayout>
    </>
  );
}
