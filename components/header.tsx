"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap-client";
import { siteNavHref, siteNavItems } from "@/config/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const isGuestList = pathname === "/khach-moi";
  const isTicketDetail = /^\/[^/]+$/.test(pathname) && !isGuestList;
  const [isGuestAccess, setIsGuestAccess] = useState(false);
  const [isTicketAdmin, setIsTicketAdmin] = useState(false);
  const useDarkHeader = isHome || (isGuestList && !isGuestAccess);
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
  const headerBackdropFilter = scrolled || menuVisible
    ? `blur(${isGuestAccess && !menuVisible ? 3 : 4}px) saturate(140%)`
    : "blur(0px) saturate(100%)";

  useEffect(() => {
    if (!isGuestList) {
      setIsGuestAccess(false);
      return;
    }
    const updateGuestAccess = () =>
      setIsGuestAccess(Boolean(document.querySelector(".guest-access")));
    updateGuestAccess();
    const observer = new MutationObserver(updateGuestAccess);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isGuestList]);

  useEffect(() => {
    setIsTicketAdmin(false);
    if (!isTicketDetail) return;

    const controller = new AbortController();
    fetch("/api/guests/session", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((session) => {
        if (!controller.signal.aborted) setIsTicketAdmin(session?.authenticated === true);
      })
      .catch(() => {
        if (!controller.signal.aborted) setIsTicketAdmin(false);
      });

    return () => controller.abort();
  }, [isTicketDetail, pathname]);

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
      if (cta) {
        timeline.fromTo(
          cta,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.36, ease: "power2.out" },
          0.34,
        );
      }
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
        className={`site-header site-header--${useDarkHeader ? "dark" : "light"} fixed inset-x-0 top-0 z-[100] ${scrolled || menuVisible ? "is-scrolled" : ""}`}
        style={{
          ...(menuVisible ? { background: "rgba(5,25,65,.98)" } : {}),
          backdropFilter: headerBackdropFilter,
          WebkitBackdropFilter: headerBackdropFilter,
        }}
      >
        <div className="site-container relative flex h-[72px] items-center justify-between gap-4 lg:h-[78px]">
          <Link href="/" aria-label="Trang chủ AN VUI" className="shrink-0">
            <Image
              src="/assets/logo-anvui.webp"
              alt="AN VUI"
              width={130}
              height={78}
              className={`h-auto w-[104px] object-contain lg:w-[126px] ${useDarkHeader || menuVisible ? "brightness-0 invert" : ""}`}
            />
          </Link>
          <nav
            aria-label="Điều hướng chính"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 lg:flex"
          >
            {siteNavItems.map((link) => (
                  <a
                    key={link.href}
                    href={siteNavHref(link.href, isHome)}
                    target={"external" in link && link.external ? "_blank" : undefined}
                    rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
                    aria-current={isHome && !("external" in link && link.external) && activeSection === link.href ? "location" : undefined}
                    className={`whitespace-nowrap rounded-full px-2 py-2 text-[12px] font-medium transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe2a2] xl:px-4 xl:text-[13px] ${isHome && !("external" in link && link.external) && activeSection === link.href ? "bg-white/15 text-[#ffe2a2]" : useDarkHeader ? "text-white" : "text-[#092450]"}`}
                  >
                    {link.label}
                  </a>
                ))}
          </nav>
          <div className="flex items-center gap-2">
            {isGuestAccess && <span className="guest-access-header-pill"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18m-12 4h2m3 0h2m-7 3h2" /></svg><span>11 NĂM VỮNG BƯỚC<br />NHIỀU HÀNH TRÌNH ĐẸP HƠN</span></span>}
            {!isHome && !isTicketDetail && (
              <Link href="/" aria-label="Trở về trang chủ" className={`inline-flex h-10 w-10 items-center justify-center rounded-full border lg:hidden ${useDarkHeader ? "border-white/25 bg-white/5 text-white hover:bg-white/12" : "border-[#092450]/25 bg-[#092450]/5 text-[#092450] hover:bg-[#092450]/10"}`}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" /></svg>
              </Link>
            )}
            {isTicketDetail && isTicketAdmin && (
              <Link href="/khach-moi" aria-label="Quay lại danh sách" className="guest-access-header-pill ticket-list-header-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6M8 12h12" /></svg>
                <span>Quay lại danh sách</span>
              </Link>
            )}
            {!isTicketDetail && <Link
              href={isHome ? "/khach-moi" : "/"}
              className={`hidden shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-colors lg:inline-flex ${isHome ? "bg-[#fff8e9] text-[#092450] shadow-md hover:bg-white" : useDarkHeader ? "border border-white/25 bg-white/5 text-white hover:bg-white/12" : "border border-[#092450]/25 bg-[#092450]/5 text-[#092450] hover:bg-[#092450]/10"}`}
            >
              {!isHome ? (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" /></svg>
                  Trở về trang chủ
                </>
              ) : "Danh sách khách mời"}
            </Link>}
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
              className={`rounded-lg p-2 lg:hidden ${useDarkHeader || menuVisible ? "text-white" : "text-[#06107C]"}`}
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
          {siteNavItems.map((link) => (
            <a
              key={link.href}
              data-menu-link
              href={siteNavHref(link.href, isHome)}
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
          {(!isTicketDetail || isTicketAdmin) && <Link
            href={isTicketDetail || isHome ? "/khach-moi" : "/"}
            data-menu-cta
            onClick={handleMenuLinkClick}
            className="mt-3 flex min-h-[50px] w-full items-center justify-center rounded-full bg-[linear-gradient(90deg,#f4c75d,#ffe19a)] px-4 text-center text-sm font-semibold text-[#092450]"
          >
            {isTicketDetail ? "Quay lại danh sách" : isHome ? "Danh sách khách mời" : "Trở về trang chủ"}
          </Link>}
        </nav>
      </header>
    </>
  );
}
