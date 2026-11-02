"use client";

import { useEffect, useState } from "react";

const storageKey = "pergage-analytics-consent";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true") return;
    try {
      setVisible(window.localStorage.getItem(storageKey) === null);
    } catch {
      setVisible(false);
    }
  }, []);

  function choose(value: "accepted" | "essential-only") {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
      // Analytics remains opt-in even when browser storage is unavailable.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside className="consent-banner" aria-label="Cookie consent">
      <div>
        <strong>Privacy first.</strong>
        <p>
          This preview uses essential browser storage only. Analytics will stay off unless
          you choose to allow it.
        </p>
      </div>
      <div className="consent-actions">
        <button className="button button-outline" onClick={() => choose("essential-only")}>
          Essential only
        </button>
        <button className="button button-dark" onClick={() => choose("accepted")}>
          Allow analytics
        </button>
      </div>
    </aside>
  );
}
