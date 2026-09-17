"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap-client";
import { GALLERY_DRIVE_URL } from "@/lib/anniversary-links";

const homeLinks = [
  { label: "Trang chủ", href: "#trang-chu" },
  { label: "Thông tin sự kiện", href: "#su-kien" },
  { label: "Dấu mốc 11 năm", href: "#dau-moc" },
  { label: "Hình ảnh", href: GALLERY_DRIVE_URL, external: true },
  { label: "Liên hệ", href: "#lien-he" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#trang-chu");
  const headerRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const topLineRef = useRef<HTMLSpanElement>(null);
  const middleLineRef = useRef<HTMLSpanElement>(null);
  const bottomLineRef = useRef<HTMLSpanElement>(null);
  const menuTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const pendingNavigationRef = useRef<(() => void) | null>(null);
  const replayingAnchorRef = useRef(false);
  const previousOverflowRef = useRef("");
  const bodyLockedRef = useRef(false);

  const unlockBody = () => {
    if (!bodyLockedRef.current) return;
    document.body.style.overflow = previousOverflowRef.current;
    bodyLockedRef.current = false;
  };

  const closeMenu = (afterClose?: () => void) => {
    pendingNavigationRef.current = afterClose ?? null;
    setOpen(false);
  };

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!isHome) return;

    const sections = ["dau-moc", "su-kien", "lien-he"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const threshold = Math.min(window.innerHeight * 0.35, 320);
      let current = "#trang-chu";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= threshold) {
          current = `#${section.id}`;
        }
      }
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2
      ) {
        current = "#lien-he";
      }
      setActiveSection((previous) =>
        previous === current ? previous : current,
      );
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [isHome]);

  useEffect(() => {
    const header = headerRef.current;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    const topLine = topLineRef.current;
    const middleLine = middleLineRef.current;
    const bottomLine = bottomLineRef.current;
    if (
      !header ||
      !backdrop ||
      !panel ||
      !topLine ||
      !middleLine ||
      !bottomLine
    )
      return;

    const context = gsap.context(() => {
      const links = panel.querySelectorAll("[data-menu-link]");
      const cta = panel.querySelector("[data-menu-cta]");
      const timeline = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          backdrop.style.pointerEvents = "none";
          panel.style.pointerEvents = "none";
          unlockBody();
          setMenuVisible(false);
          const navigate = pendingNavigationRef.current;
          pendingNavigationRef.current = null;
          navigate?.();
        },
      });
      timeline
        .to(backdrop, { autoAlpha: 1, duration: 0.32, ease: "power2.out" }, 0)
        .fromTo(
          panel,
          { autoAlpha: 0, y: -10 },
          { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" },
          0,
        )
        .fromTo(
          links,
          { autoAlpha: 0, y: 8 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.32,
            stagger: 0.05,
            ease: "power2.out",
          },
          0.12,
        )
        .fromTo(
          cta,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.36, ease: "power2.out" },
          0.34,
        )
        .to(
          topLine,
          { y: 6, rotation: 45, duration: 0.35, ease: "power2.inOut" },
          0,
        )
        .to(
          middleLine,
          { autoAlpha: 0, scaleX: 0, duration: 0.3, ease: "power2.inOut" },
          0,
        )
        .to(
          bottomLine,
          { y: -6, rotation: -45, duration: 0.35, ease: "power2.inOut" },
          0,
        );
      menuTimelineRef.current = timeline;
    }, header);

    return () => {
      pendingNavigationRef.current = null;
      menuTimelineRef.current = null;
      unlockBody();
      context.revert();
    };
  }, [isHome]);

  useEffect(() => {
    const timeline = menuTimelineRef.current;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!timeline || !backdrop || !panel) return;
    if (open) {
      if (!bodyLockedRef.current) {
        previousOverflowRef.current = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        bodyLockedRef.current = true;
      }
      backdrop.style.pointerEvents = "auto";
      panel.style.pointerEvents = "auto";
      timeline.timeScale(1).play();
    } else if (menuVisible) {
      timeline.timeScale(1.65).reverse();
    }
  }, [open, menuVisible, isHome]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    const breakpoint = window.matchMedia("(min-width: 1024px)");
    const closeAtDesktop = () => {
      if (!breakpoint.matches) return;
      pendingNavigationRef.current = null;
      menuTimelineRef.current?.pause(0);
      backdropRef.current?.style.setProperty("pointer-events", "none");
      panelRef.current?.style.setProperty("pointer-events", "none");
      unlockBody();
      setOpen(false);
      setMenuVisible(false);
    };
    breakpoint.addEventListener("change", closeAtDesktop);
    return () => breakpoint.removeEventListener("change", closeAtDesktop);
  }, []);

  useEffect(() => {
    pendingNavigationRef.current = null;
    menuTimelineRef.current?.pause(0);
    backdropRef.current?.style.setProperty("pointer-events", "none");
    panelRef.current?.style.setProperty("pointer-events", "none");
    unlockBody();
    setOpen(false);
    setMenuVisible(false);
  }, [pathname]);

  const handleMenuLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (replayingAnchorRef.current) {
      replayingAnchorRef.current = false;
      event.preventDefault();
      return;
    }
    const href = event.currentTarget.getAttribute("href") ?? "";
    if (href.startsWith("#")) {
      event.preventDefault();
      event.stopPropagation();
      const anchor = event.currentTarget;
      closeMenu(() => {
        // Let the existing Lenis anchor listener handle scrolling after the menu closes.
        replayingAnchorRef.current = true;
        anchor.click();
      });
    } else if (href.startsWith("/")) {
      event.preventDefault();
      closeMenu(() => router.push(href));
    } else {
      closeMenu();
    }
  };

  return (
    <>
      <button
        ref={backdropRef}
        data-lenis-prevent
        type="button"
        aria-label="Đóng menu"
        tabIndex={menuVisible ? 0 : -1}
        onClick={() => closeMenu()}
        className="fixed inset-0 z-[90] border-0 bg-[rgba(2,16,48,0.45)] p-0 backdrop-blur-[8px] lg:hidden"
        style={{ opacity: 0, visibility: "hidden", pointerEvents: "none" }}
      />
      <header
        ref={headerRef}
        className={`site-header fixed inset-x-0 top-0 z-[100] transition-colors duration-300 ${isHome ? (scrolled || menuVisible ? "bg-[#061a3b]/90 shadow-lg backdrop-blur-xl" : "bg-transparent") : "bg-white/95 shadow-sm backdrop-blur-xl"}`}
        style={menuVisible ? { background: "rgba(5,25,65,.98)" } : undefined}
      >
        <div className="relative mx-auto flex h-[72px] w-[calc(100%-40px)] max-w-[1320px] items-center justify-between gap-4 sm:w-[calc(100%-76px)] lg:h-[78px]">
          <Link href="/" aria-label="Trang chủ AN VUI" className="shrink-0">
            <Image
              src="/assets/logo-anvui.webp"
              alt="AN VUI"
              width={130}
              height={78}
              className={`h-auto w-[104px] object-contain lg:w-[126px] ${isHome || menuVisible ? "brightness-0 invert" : ""}`}
            />
          </Link>
          <nav
            aria-label="Điều hướng chính"
            className={`hidden items-center gap-2 lg:flex ${isHome ? "absolute left-1/2 -translate-x-1/2" : ""}`}
          >
            {isHome
              ? homeLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    aria-current={!link.external && activeSection === link.href ? "location" : undefined}
                    className={`whitespace-nowrap rounded-full px-2 py-2 text-[12px] font-medium transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe2a2] xl:px-4 xl:text-[13px] ${!link.external && activeSection === link.href ? "bg-white/15 text-[#ffe2a2]" : "text-white"}`}
                  >
                    {link.label}
                  </a>
                ))
              : null}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/khach-moi"
              className={`hidden shrink-0 items-center justify-center rounded-full px-5 py-2.5 text-xs font-bold shadow-md transition-transform hover:-translate-y-0.5 lg:inline-flex ${isHome ? "bg-[#fff8e9] text-[#092450]" : "bg-[#06107C] text-white"}`}
            >
              Danh sách khách mời
            </Link>
            <button
              type="button"
              aria-label={open ? "Đóng menu" : "Mở menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => {
                pendingNavigationRef.current = null;
                if (!open) setMenuVisible(true);
                setOpen((value) => !value);
              }}
              className={`rounded-lg p-2 lg:hidden ${isHome || menuVisible ? "text-white" : "text-[#06107C]"}`}
            >
              <span className="relative block h-6 w-6" aria-hidden="true">
                <span
                  ref={topLineRef}
                  className="absolute left-1 top-[5px] h-[2px] w-4 rounded-full bg-current"
                />
                <span
                  ref={middleLineRef}
                  className="absolute left-1 top-[11px] h-[2px] w-4 rounded-full bg-current"
                />
                <span
                  ref={bottomLineRef}
                  className="absolute left-1 top-[17px] h-[2px] w-4 rounded-full bg-current"
                />
              </span>
            </button>
          </div>
        </div>
        <nav
          ref={panelRef}
          data-lenis-prevent
          id="mobile-nav"
          aria-label="Điều hướng di động"
          aria-hidden={!menuVisible}
          className="absolute inset-x-0 top-full rounded-b-[20px] border-t border-white/[.06] px-5 pb-6 pt-4 text-white shadow-[0_24px_60px_rgba(0,0,0,.25)] backdrop-blur-[18px] sm:px-[38px] lg:hidden"
          style={{
            opacity: 0,
            visibility: "hidden",
            pointerEvents: "none",
            willChange: "transform, opacity",
            background: "rgba(5,25,65,.98)",
          }}
        >
          {(isHome
            ? homeLinks
            : [
                { label: "Trang chủ", href: "/" },
                {
                  label: "Hình ảnh sự kiện",
                  href: GALLERY_DRIVE_URL,
                  external: true,
                },
              ]
          ).map((link) => (
            <a
              key={link.href}
              data-menu-link
              href={link.href}
              target={
                "external" in link && link.external ? "_blank" : undefined
              }
              rel={
                "external" in link && link.external
                  ? "noopener noreferrer"
                  : undefined
              }
              aria-current={isHome && !("external" in link && link.external) && activeSection === link.href ? "location" : undefined}
              onClick={handleMenuLinkClick}
              className={`flex min-h-11 items-center rounded-md px-1 text-sm font-semibold active:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe2a2] ${isHome && !("external" in link && link.external) && activeSection === link.href ? "bg-white/10 text-[#ffe2a2]" : ""}`}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/khach-moi"
            data-menu-cta
            onClick={handleMenuLinkClick}
            className="mt-3 flex min-h-[50px] w-full items-center justify-center rounded-full bg-[linear-gradient(90deg,#f4c75d,#ffe19a)] px-4 text-center text-sm font-semibold text-[#092450]"
          >
            Danh sách khách mời
          </Link>
        </nav>
      </header>
    </>
  );
}
