import { heroTicker } from "../data/content";
import { MarqueeText } from "./MarqueeText";

type HeroProps = { onOpenContact: (trigger: HTMLButtonElement) => void };

export function Hero({ onOpenContact }: HeroProps) {
  return (
    <header className="hero" id="top">
      <img className="hero-image" src="/aisha-onola.jpg" width="810" height="1080" alt="Aisha Onola smiling at an event" />
      <div className="hero-wash" aria-hidden="true" />
      <div className="hero-tint" aria-hidden="true" />
      <p className="hero-location eyebrow"><span className="track-no" aria-hidden="true">A1</span> Lagos, Nigeria</p>
      <div className="hero-copy">
        <h1><span>Aisha</span> <span className="onola-word">Onola</span> <em className="handwritten">— hi!</em></h1>
        <p>I write, build media, and take good ideas all the way to something real.</p>
        <button className="contact-trigger hero-contact-trigger" type="button" onClick={(event) => onOpenContact(event.currentTarget)}>Have something in mind? <span aria-hidden="true">↗</span></button>
      </div>
      <a className="scroll-cue" href="#about">Scroll <span aria-hidden="true">↓</span></a>
      <div className="ticker" aria-hidden="true"><div><MarqueeText items={heroTicker} /></div></div>
    </header>
  );
}
