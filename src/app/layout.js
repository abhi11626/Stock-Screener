import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  icons: {
    icon: "/icon.png",
  },
  title: "Stock Dashboard | Abhishek Gupta",
  description:
    "Real-time stock dashboard with search, watchlist, and performance optimizations.",
  openGraph: {
    title: "Stock Dashboard",
    description: "Search stocks, track watchlist, and view real-time updates.",
    url: "https://stock-screener-beta-cyan.vercel.app/",
    siteName: "Stock Dashboard",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stock Dashboard Preview",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  );
}
