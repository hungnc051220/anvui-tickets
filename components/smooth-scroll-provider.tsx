"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScrollProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      lerp: 0.14,
      syncTouch: false,
      anchors: true,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
