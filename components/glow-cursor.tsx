"use client";

import { useEffect, useRef } from "react";

export function GlowCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const onMove = (event: MouseEvent) => {
      if (!ref.current) {
        return;
      }

      ref.current.style.left = `${event.clientX}px`;
      ref.current.style.top = `${event.clientY}px`;
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return <div ref={ref} className="glow-cursor" aria-hidden="true" />;
}
