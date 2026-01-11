import "./globals.css";
import { Orbitron, Inter } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}