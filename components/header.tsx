"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GALLERY_DRIVE_URL } from "@/lib/anniversary-links";

const homeLinks = [
  { label: "Trang chủ", href: "#trang-chu" },
  { label: "Giới thiệu sự kiện", href: "#su-kien" },
  { label: "Lịch trình", href: "#lich-trinh" },
  { label: "Dấu mốc 11 năm", href: "#dau-moc" },
  { label: "Hình ảnh", href: GALLERY_DRIVE_URL, external: true },
  { label: "Liên hệ", href: "#lien-he" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-[100] transition-colors duration-300 ${isHome ? (scrolled || open ? "bg-[#061a3b]/90 shadow-lg backdrop-blur-xl" : "bg-transparent") : "bg-white/95 shadow-sm backdrop-blur-xl"}`}
    >
      <div className="relative mx-auto flex h-[72px] w-[calc(100%-40px)] max-w-[1320px] items-center justify-between gap-4 sm:w-[calc(100%-76px)] lg:h-[78px]">
        <Link href="/" aria-label="Trang chủ AN VUI" className="shrink-0">
          <Image
            src="/assets/logo-anvui.webp"
            alt="AN VUI"
            width={130}
            height={78}
            className={`h-auto w-[104px] object-contain lg:w-[126px] ${isHome ? "brightness-0 invert" : ""}`}
          />
        </Link>
        <nav
          aria-label="Điều hướng chính"
          className={`hidden items-center gap-2 lg:flex ${isHome ? "absolute left-1/2 -translate-x-1/2" : ""}`}
        >
          {isHome
            ? homeLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={`whitespace-nowrap rounded-full px-2 py-2 text-[12px] font-medium text-white transition-colors hover:bg-white/15 xl:px-4 xl:text-[13px] ${index === 0 ? "bg-white/12" : ""}`}
                >
                  {link.label}
                </a>
              ))
            : null}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/khach-moi"
            className={`hidden shrink-0 items-center justify-center rounded-full px-5 py-2.5 text-xs font-bold shadow-md transition-transform hover:-translate-y-0.5 sm:inline-flex ${isHome ? "bg-[#fff8e9] text-[#092450]" : "bg-[#06107C] text-white"}`}
          >
            Danh sách khách mời
          </Link>
          <button
            type="button"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className={`rounded-lg p-2 lg:hidden ${isHome ? "text-white" : "text-[#06107C]"}`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M5 5l14 14M19 5 5 19" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      <nav
        id="mobile-nav"
        aria-label="Điều hướng di động"
        className={`absolute left-3 right-3 top-full mt-1 rounded-2xl p-3 shadow-xl backdrop-blur-xl lg:hidden ${isHome ? "bg-[#09244e]/95 text-white" : "bg-white text-[#06107C]"} ${open ? "" : "hidden"}`}
      >
        {(isHome
          ? homeLinks
          : [
              { label: "Trang chủ", href: "/" },
              { label: "Hình ảnh sự kiện", href: GALLERY_DRIVE_URL, external: true },
            ]
        ).map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={"external" in link && link.external ? "_blank" : undefined}
            rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
            onClick={() => setOpen(false)}
            className="block rounded-lg px-4 py-3 text-sm font-semibold hover:bg-white/10"
          >
            {link.label}
          </a>
        ))}
        <Link
          href="/khach-moi"
          onClick={() => setOpen(false)}
          className={`mt-2 block rounded-full px-4 py-3 text-center text-sm font-bold sm:hidden ${isHome ? "bg-[#fff8e9] text-[#092450]" : "bg-[#06107C] text-white"}`}
        >
          Danh sách khách mời
        </Link>
      </nav>
    </header>
  );
}
