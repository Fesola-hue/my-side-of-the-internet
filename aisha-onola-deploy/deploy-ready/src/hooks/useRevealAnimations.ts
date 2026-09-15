import { useEffect } from "react";

export function useRevealAnimations(): void {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".reveal");
    const credits = document.querySelectorAll<HTMLElement>(".credits li");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) {
      [...items, ...credits].forEach((item) => item.classList.add("in-view"));
      return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    const creditObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const item = entry.target as HTMLElement;
        const siblings = item.parentElement ? [...item.parentElement.children] : [];
        item.style.transitionDelay = `${siblings.indexOf(item) * 0.12}s`;
        item.classList.add("in-view");
        creditObserver.unobserve(item);
      });
    }, { threshold: 0.15 });

    items.forEach((item) => revealObserver.observe(item));
    credits.forEach((item) => creditObserver.observe(item));
    return () => {
      revealObserver.disconnect();
      creditObserver.disconnect();
    };
  }, []);
}
