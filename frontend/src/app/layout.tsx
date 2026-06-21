import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StorefrontLayout from "../components/store/StorefrontLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cartify - Premium eCommerce Storefront",
  description: "Experience the next level of eCommerce with Stripe-level spacing, Apple-level polish, and Shopify-level UX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans selection:bg-accent/10 selection:text-accent bg-white text-primary">
        <StorefrontLayout>{children}</StorefrontLayout>
      </body>
    </html>
  );
}
