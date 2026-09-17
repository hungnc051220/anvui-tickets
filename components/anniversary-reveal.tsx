"use client";

import { useEffect } from "react";

export default function AnniversaryReveal() {
  useEffect(() => {
    const root = document.querySelector(".anniversary-page");
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );

    for (const item of items) {
      const bounds = item.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 0.94 && bounds.bottom > 0) {
        item.classList.add("is-revealed");
      } else {
        item.classList.add("reveal-ready");
        observer.observe(item);
      }
    }

    const showAll = () => {
      if (!reducedMotion.matches) return;
      observer.disconnect();
      for (const item of items) item.classList.add("is-revealed");
    };
    reducedMotion.addEventListener("change", showAll);

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", showAll);
    };
  }, []);

  return null;
}
