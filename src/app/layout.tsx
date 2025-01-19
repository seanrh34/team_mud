import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "DozeBuster",
  description: "U Snooze, U Lose",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        {/* Navbar included on all pages */}
        <Navbar />
        <main className="bg-gray-900 text-gray-100 flex-grow">{children}</main>
        {/* Footer included on all pages */}
        <Footer />
      </body>
    </html>
  );
}
