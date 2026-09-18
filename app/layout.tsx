import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import SiteLayout from "@/components/site-layout";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "11 năm AN VUI | Cùng nhau đi xa hơn",
    description:
      "Kỷ niệm 11 năm AN VUI: cùng nhìn lại hành trình, những dấu mốc công nghệ và thông tin sự kiện ngày 23/09/2026.",
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: "11 năm AN VUI | Cùng nhau đi xa hơn",
      description:
        "Kỷ niệm 11 năm AN VUI: cùng nhìn lại hành trình, những dấu mốc công nghệ và thông tin sự kiện ngày 23/09/2026.",
      type: "article",
      authors: ["hungnc"],
    },
    robots: {
      index: true, // Allow indexing for all robots
      follow: true, // Allow link following
      nocache: true, // Prevent caching
      googleBot: {
        index: true, // Allow indexing
        follow: true, // Allow link following
        noimageindex: true, // Prevent image indexing
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} antialiased`}>
        <SmoothScrollProvider />
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
