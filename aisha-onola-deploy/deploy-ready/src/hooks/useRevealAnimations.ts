import { useEffect } from "react";

export function useRevealAnimations(): void {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".world-reveal");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("in-view"));
      return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    items.forEach((item) => revealObserver.observe(item));
    return () => {
      revealObserver.disconnect();
    };
  }, []);
}
