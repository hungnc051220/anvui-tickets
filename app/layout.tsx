import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "AN VUI trân trọng kính mời tham dự sự kiện 11 năm",
    description:
      "Nhân dịp sinh nhật Công ty, Ban Lãnh đạo trân trọng kính mời toàn thể anh chị em cùng gia đình tham dự buổi lễ kỷ niệm",
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: "AN VUI trân trọng kính mời tham dự sự kiện 11 năm",
      description:
        "Nhân dịp sinh nhật Công ty, Ban Lãnh đạo trân trọng kính mời toàn thể anh chị em cùng gia đình tham dự buổi lễ kỷ niệm",
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
      <body className={`${quicksand.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
