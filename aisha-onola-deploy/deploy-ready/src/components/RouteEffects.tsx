import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function RouteEffects() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    const changedPage = previousPath.current !== location.pathname;
    previousPath.current = location.pathname;
    const frame = requestAnimationFrame(() => {
      if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
      else if (changedPage) window.scrollTo(0, 0);
      if (changedPage) document.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.hash, location.pathname]);

  return <span className="sr-only" aria-live="polite" aria-atomic="true">{location.pathname === "/speaking" ? "Speaking page" : "Home page"}</span>;
}
