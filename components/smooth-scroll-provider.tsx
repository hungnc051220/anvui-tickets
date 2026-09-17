"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap-client";

export default function SmoothScrollProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      lerp: 0.14,
      syncTouch: false,
      anchors: true,
      stopInertiaOnNavigate: true,
      respectReducedMotion: false,
    });
    const update = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  return null;
}
