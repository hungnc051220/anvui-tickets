"use client";

import Link from "next/link";
import React, { useState } from "react";
import { GALLERY_DRIVE_URL } from "@/lib/anniversary-links";

// Usage: import MobileNavbar from '@/components/MobileNavbar'
// <MobileNavbar />

export default function MobileNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        ☰
      </button>

      <div
        className={`overflow-hidden top-full transition-[max-height] duration-500 ease-in-out bg-white shadow-md ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          <a
            href={GALLERY_DRIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Hình ảnh sự kiện
          </a>
          <Link href="/" className="hover:underline">
            Trợ giúp
          </Link>
          <Link href="/" className="hover:underline">
            Ghi chú
          </Link>
        </nav>
      </div>
    </div>
  );
}
