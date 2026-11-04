"use client";

import { useEffect, useRef } from "react";

const PULSE_MS = 4000;

/**
 * One-shot gilt heartbeat on the header wordmark. Opacity only;
 * this drops `will-change` once the two double-beats finish.
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
      return name === "logoGoldPulse" && anim.playState === "finished";
    }) ?? false;
    if (finished) {
      settle();
      return;
    }

    const onEnd = (event: AnimationEvent) => {
      if (event.animationName !== "logoGoldPulse") return;
      settle();
    };

    logo.addEventListener("animationend", onEnd);
    const timer = window.setTimeout(settle, PULSE_MS + 700);
    return () => {
      logo.removeEventListener("animationend", onEnd);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <span className="logo__pulse" ref={ref} aria-hidden="true">
      <span className="logo__tint" />
    </span>
  );
}
