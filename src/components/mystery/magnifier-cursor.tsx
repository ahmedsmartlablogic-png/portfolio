"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom magnifying-glass cursor.
 * Renders a brass detective lens that trails the pointer with a slight lag,
 * enlarging over interactive elements. Only active on fine-pointer devices
 * (the container stays hidden via CSS on touch devices).
 */
export function MagnifierCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");

    // hide the native cursor only where a real pointer exists;
    // lens visibility itself is gated purely by CSS (.magnifier-root)
    if (fine.matches) {
      document.body.classList.add("mystery-cursor");
    }

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest?.(
        'a, button, input, textarea, select, label, [role="button"], [data-magnify]'
      );
      setZoom(interactive);
    };

    const loop = () => {
      x += (tx - x) * 0.3;
      y += (ty - y) * 0.3;
      if (rootRef.current) {
        rootRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      if (fine.matches) document.body.classList.remove("mystery-cursor");
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="magnifier-root pointer-events-none fixed left-0 top-0 z-[90]"
    >
      <div className="relative">
        {/* lens */}
        <div
          className={`relative -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brass/80 shadow-[0_0_18px_rgba(247,185,85,0.25),inset_0_0_22px_rgba(0,0,0,0.45)] transition-[width,height] duration-200 ${
            zoom ? "h-[104px] w-[104px] opacity-100" : "h-[76px] w-[76px] opacity-95"
          }`}
          style={{
            background:
              "radial-gradient(circle at 34% 28%, rgba(255,240,205,0.30), rgba(140,105,45,0.10) 58%, rgba(30,20,8,0.22) 100%)",
            backdropFilter: "sepia(0.25) brightness(1.06) contrast(1.03)",
            WebkitBackdropFilter: "sepia(0.25) brightness(1.06) contrast(1.03)",
          }}
        >
          {/* glass glint */}
          <span className="absolute left-[22%] top-[16%] h-[22%] w-[34%] -rotate-[25deg] rounded-full bg-white/25 blur-[2px]" />
          {/* crosshair */}
          <span className="absolute left-1/2 top-[12%] h-[14%] w-px -translate-x-1/2 bg-brass/40" />
          <span className="absolute left-1/2 bottom-[12%] h-[14%] w-px -translate-x-1/2 bg-brass/40" />
          <span className="absolute top-1/2 left-[12%] w-[14%] h-px -translate-y-1/2 bg-brass/40" />
          <span className="absolute top-1/2 right-[12%] w-[14%] h-px -translate-y-1/2 bg-brass/40" />
          {/* handle */}
          <span
            className={`absolute left-[86%] top-[86%] h-[10px] w-[46px] origin-top-left rotate-45 rounded-full border border-black/40 shadow-md transition-[width] duration-200 ${
              zoom ? "w-[58px]" : "w-[46px]"
            }`}
            style={{
              background:
                "linear-gradient(180deg, #4a3418 0%, #6b4a22 45%, #2e2010 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
