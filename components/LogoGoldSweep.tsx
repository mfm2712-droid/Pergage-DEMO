"use client";

import { useEffect, useRef } from "react";

const GLOW_MS = 3000;

/**
 * One-shot 3D gilt glow over the whole header logo.
 * Drops `will-change` once the light has settled.
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
      return name === "logoGlow3d" && anim.playState === "finished";
    }) ?? false;
    if (finished) {
      settle();
      return;
    }

    const onEnd = (event: AnimationEvent) => {
      if (event.animationName !== "logoGlow3d") return;
      settle();
    };

    logo.addEventListener("animationend", onEnd);
    const timer = window.setTimeout(settle, GLOW_MS + 500);
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
