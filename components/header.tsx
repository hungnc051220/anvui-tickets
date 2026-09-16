"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PHOTOS_URL =
  "https://drive.google.com/drive/folders/1KrsJia9YtjotHjkGcREGhYoaEW3urCZq";
const DIRECTIONS_URL =
  "https://www.google.com/maps/place/Tr%C3%A0ng+An+Palace/@21.002741,105.8055424,17z/data=!3m1!4b1!4m6!3m5!1s0x3135ad6f65c2afff:0x86b971cd73de1552!8m2!3d21.002741!4d105.8055424!16s%2Fg%2F11h0cf9sjn?entry=ttu&g_ep=EgoyMDI2MDkxMy4wIKXMDSoASAFQAw%3D%3D";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const updateScroll = () =>
      setScrolled((current) => window.scrollY > (current ? 8 : 24));
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const navClass = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06107C] ${
      active
        ? "bg-[#06107C]/10 text-[#06107C]"
        : "text-slate-700 hover:bg-[#06107C]/5 hover:text-[#06107C]"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-[padding,background-color] duration-200 ${
        scrolled ? "px-3 pt-3 sm:px-5" : "bg-white/95"
      }`}
    >
      <div
        className={`relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 backdrop-blur-xl transition-[background-color,box-shadow,border-radius] duration-200 lg:h-20 lg:px-6 ${
          scrolled
            ? "rounded-2xl bg-white/80 shadow-[0_12px_36px_rgba(6,16,124,0.12)]"
            : ""
        }`}
      >
        <Link href="/" aria-label="Trang chủ AN VUI" className="shrink-0">
          <Image
            src="/assets/logo-anvui.webp"
            alt="AN VUI"
            width={200}
            height={200}
            className="h-auto w-24 object-contain lg:w-28"
          />
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 lg:flex">
          <Link href="/" className={navClass(pathname === "/")}>
            Trang chủ
          </Link>
          <Link href="/khach-moi" className={navClass(pathname === "/khach-moi")}>
            Danh sách khách mời
          </Link>
          <a href={PHOTOS_URL} target="_blank" rel="noopener noreferrer" className={navClass(false)}>
            Hình ảnh sự kiện
          </a>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-[#06107C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#121f9b] hover:shadow-md lg:inline-block"
          >
            Di chuyển
          </a>
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#06107C] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#121f9b] lg:hidden"
          >
            Di chuyển
          </a>
          <button
            type="button"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((current) => !current)}
            className="rounded-xl p-2.5 text-[#06107C] transition-colors hover:bg-[#06107C]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06107C] lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? (
                <path d="M5 5l14 14M19 5L5 19" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <nav
          id="mobile-nav"
          aria-label="Điều hướng di động"
          aria-hidden={!open}
          className={`absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl bg-white/90 shadow-xl backdrop-blur-xl transition-[opacity,transform] duration-200 lg:hidden ${
            open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1 p-3">
            <Link href="/" className={navClass(pathname === "/")} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              Trang chủ
            </Link>
            <Link href="/khach-moi" className={navClass(pathname === "/khach-moi")} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              Danh sách khách mời
            </Link>
            <a href={PHOTOS_URL} target="_blank" rel="noopener noreferrer" className={navClass(false)} tabIndex={open ? 0 : -1}>
              Hình ảnh sự kiện
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
