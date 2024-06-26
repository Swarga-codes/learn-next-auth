import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Auth App",
  description: "Full stack authentication system built using Next.js 14.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      
      <body className={inter.className}>
      <div><Toaster/></div>
       <div>{children}</div>
        </body>
      
    </html>
  );
}
