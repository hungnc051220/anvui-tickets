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
    title: "AN VUI trân trọng kính mời tham dự sự kiện 10 năm 1 hành trình",
    description:
      "Đây là sự kiện kỷ niệm 10 năm hành trình xây dựng và phát triển của Công ty Công Nghệ AN VUI. Teams AN VUI mong được đón tiếp bạn trong sự kiện quan trọng và ý nghĩa này ...",
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: "AN VUI trân trọng kính mời tham dự sự kiện 10 năm 1 hành trình",
      description:
        "Đây là sự kiện kỷ niệm 10 năm hành trình xây dựng và phát triển của Công ty Công Nghệ AN VUI. Teams AN VUI mong được đón tiếp bạn trong sự kiện quan trọng và ý nghĩa này ...",
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
    <html lang="en">
      <body className={`${quicksand.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
