"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ROUTE_PROGRESS_CANCEL, ROUTE_PROGRESS_END, ROUTE_PROGRESS_START } from "@/lib/route-progress";
import "./route-transition.css";

type ProgressState = "idle" | "loading" | "complete";

export default function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressState>("idle");
  const activeRef = useRef(false);
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const committedRouteRef = useRef<string | null>(null);
  const pendingHrefRef = useRef<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const clearTimers = useCallback(() => {
    if (watchdogRef.current) clearTimeout(watchdogRef.current);
    if (clearRef.current) clearTimeout(clearRef.current);
    watchdogRef.current = null;
    clearRef.current = null;
  }, []);

  const finish = useCallback(() => {
    if (!activeRef.current) return;
    activeRef.current = false;
    clearTimers();
    pendingHrefRef.current = null;
    committedRouteRef.current = window.location.pathname + window.location.search;
    setProgress("complete");
    window.dispatchEvent(new Event(ROUTE_PROGRESS_END));
    clearRef.current = setTimeout(() => setProgress("idle"), 220);
  }, [clearTimers]);

  const start = useCallback(() => {
    clearTimers();
    activeRef.current = true;
    setProgress("loading");
    // This only recovers from a failed navigation; it never delays a successful one.
    watchdogRef.current = setTimeout(finish, 20000);
  }, [clearTimers, finish]);

  useEffect(() => {
    committedRouteRef.current = window.location.pathname + window.location.search;

    const destinationFor = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
      const target = event.target;
      if (!(target instanceof Element)) return null;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return null;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return null;
      if (destination.pathname.startsWith("/api/")) return null;
      const current = window.location.pathname + window.location.search;
      const next = destination.pathname + destination.search;
      if (current === next) return null; // Same-page anchors are handled by Lenis.

      return destination;
    };

    const onClickCapture = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      const destination = destinationFor(event);
      if (!destination) return;
      if (activeRef.current && pendingHrefRef.current === destination.href) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      pendingHrefRef.current = destination.href;
      start();
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return; // Next <Link> and the mobile menu already navigate.
      const destination = destinationFor(event);
      if (!destination) return;
      event.preventDefault();
      router.push(destination.pathname + destination.search + destination.hash);
    };

    const onPopState = () => {
      if (window.location.pathname + window.location.search !== committedRouteRef.current) start();
    };

    window.addEventListener(ROUTE_PROGRESS_START, start);
    window.addEventListener(ROUTE_PROGRESS_CANCEL, finish);
    document.addEventListener("click", onClickCapture, true);
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener(ROUTE_PROGRESS_START, start);
      window.removeEventListener(ROUTE_PROGRESS_CANCEL, finish);
      document.removeEventListener("click", onClickCapture, true);
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
      clearTimers();
    };
  }, [clearTimers, finish, router, start]);

  useEffect(() => {
    if (!activeRef.current || contentRef.current?.querySelector("[data-route-loading]")) return;
    finish();
  }, [children, pathname, finish]);

  return (
    <>
      <div className={`route-progress route-progress--${progress}`} aria-hidden="true" />
      {progress === "loading" && <span className="sr-only" role="status">Đang chuyển trang…</span>}
      <div ref={contentRef} className="site-route-content" aria-busy={progress === "loading"}>{children}</div>
    </>
  );
}
