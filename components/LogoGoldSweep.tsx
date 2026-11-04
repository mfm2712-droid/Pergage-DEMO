"use client";

import { useEffect, useRef } from "react";

const SWEEP_MS = 3000;

/**
 * One-shot gilt light over the header mark. The sweep itself is CSS
 * (transform / opacity). This only drops `will-change` once it finishes.
 */
export function LogoGoldSweep() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sweep = ref.current;
    const logo = sweep?.parentElement;
    if (!logo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const settle = () => logo.classList.add("is-done");
    const beam = sweep.querySelector(".logo__beam");
    // An empty animation list means the sweep has not started yet (hydration can
    // beat the first frame). Only skip the wait when a sweep has already finished.
    const finished = beam?.getAnimations().some((anim) => {
      const name = "animationName" in anim ? anim.animationName : "";
      return name === "logoGoldSweep" && anim.playState === "finished";
    }) ?? false;
    if (finished) {
      settle();
      return;
    }

    const onEnd = (event: AnimationEvent) => {
      if (event.animationName !== "logoGoldSweep") return;
      settle();
    };

    logo.addEventListener("animationend", onEnd);
    const timer = window.setTimeout(settle, SWEEP_MS + 700);
    return () => {
      logo.removeEventListener("animationend", onEnd);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <span className="logo__glow" aria-hidden="true" />
      <span className="logo__sweep" ref={ref} aria-hidden="true">
        <span className="logo__beam" />
      </span>
    </>
  );
}
