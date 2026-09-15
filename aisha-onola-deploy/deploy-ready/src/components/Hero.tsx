import { useEffect, useRef } from "react";
import { heroTicker } from "../data/content";
import { MarqueeText } from "./MarqueeText";

type HeroProps = { onOpenContact: (trigger: HTMLButtonElement) => void };

export function Hero({ onOpenContact }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const updateScrollProgress = () => {
      const distance = Math.max(hero.offsetHeight * .7, 1);
      const progress = Math.min(Math.max(window.scrollY / distance, 0), 1);
      hero.style.setProperty("--hero-scroll", progress.toFixed(3));
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <header
      ref={heroRef}
      className="hero"
      id="top"
      onPointerMove={(event) => {
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        const x = (event.clientX / window.innerWidth - .5) * 2;
        const y = (event.clientY / window.innerHeight - .5) * 2;
        event.currentTarget.style.setProperty("--hero-x", x.toFixed(3));
        event.currentTarget.style.setProperty("--hero-y", y.toFixed(3));
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.removeProperty("--hero-x");
        event.currentTarget.style.removeProperty("--hero-y");
      }}
    >
      <img className="hero-image" src="/aisha-onola.jpg" width="810" height="1080" alt="Aisha Onola smiling at an event" />
      <div className="hero-wash" aria-hidden="true" />
      <div className="hero-tint" aria-hidden="true" />
      <p className="hero-location eyebrow"><span className="track-no" aria-hidden="true">A1</span> Lagos, Nigeria</p>
      <div className="hero-copy">
        <h1><span>Aisha</span> <span className="onola-word">Onola</span> <em className="handwritten">— hi!</em></h1>
        <p>I build media, make sense of messy work, and ship useful things on the internet.</p>
        <div className="hero-actions">
          <a className="hero-explore-trigger" href="#built">Explore what I've built <span aria-hidden="true">↓</span></a>
          <button className="contact-trigger hero-contact-trigger" type="button" onClick={(event) => onOpenContact(event.currentTarget)}>Have something in mind? <span aria-hidden="true">↗</span></button>
        </div>
      </div>
      <a className="scroll-cue" href="#about">Scroll <span aria-hidden="true">↓</span></a>
      <div className="ticker" aria-hidden="true"><div><MarqueeText items={heroTicker} /></div></div>
    </header>
  );
}
