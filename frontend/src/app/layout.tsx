import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "International Journal of Biochemical and Allied Health Research (IJBAHR)",
  description: "A peer-reviewed platform dedicated to publishing high-quality research that connects basic Biochemical science with Medical and Allied Health.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-zinc-50 font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
        <AuthProvider>
          <Header />
          <main className="flex w-full flex-1 flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
