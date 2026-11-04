"use client";

import { useEffect, useRef } from "react";

const NEON_MS = 2600;

/**
 * One-shot neon flicker over the whole header logo.
 * Drops `will-change` once the sign has faded out.
 */
export function LogoGoldSweep() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const pulse = ref.current;
    const logo = pulse?.parentElement;
    if (!logo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const settle = () => logo.classList.add("is-done");
    const layer = pulse.querySelector(".logo__tint");
    const finished = layer?.getAnimations().some((anim) => {
      const name = "animationName" in anim ? anim.animationName : "";
      return name === "logoNeon" && anim.playState === "finished";
    }) ?? false;
    if (finished) {
      settle();
      return;
    }

    const onEnd = (event: AnimationEvent) => {
      if (event.animationName !== "logoNeon") return;
      settle();
    };

    logo.addEventListener("animationend", onEnd);
    const timer = window.setTimeout(settle, NEON_MS + 700);
    return () => {
      logo.removeEventListener("animationend", onEnd);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <span className="logo__pulse" ref={ref} aria-hidden="true">
      <span className="logo__halo"><span className="logo__shape" /></span>
      <span className="logo__tint"><span className="logo__shape" /></span>
    </span>
  );
}
