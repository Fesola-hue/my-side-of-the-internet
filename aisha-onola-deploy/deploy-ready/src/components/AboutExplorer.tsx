import { useState } from "react";
import { Link } from "react-router-dom";
import { personalStatus } from "../data/content";

const lenses = [
  { id: "serious", label: "Serious", caption: "in my serious era", note: "Make it easier to understand, use, or keep." },
  { id: "building", label: "Building", caption: "making useful things", note: "I make small internet products when I want something to exist." },
  { id: "offscript", label: "OffScript", caption: "following the story", note: "I shape the editorial direction, write and edit the stories." },
] as const;

export function AboutExplorer() {
  const [selectedId, setSelectedId] = useState<(typeof lenses)[number]["id"]>(lenses[0].id);
  const [previewId, setPreviewId] = useState<(typeof lenses)[number]["id"] | null>(null);
  const [statusIndex, setStatusIndex] = useState(0);
  const active = lenses.find((lens) => lens.id === (previewId ?? selectedId)) ?? lenses[0];
  const status = personalStatus[statusIndex];

  return (
    <div className="about-explorer">
      <div className="about-copy">
        <p className="eyebrow"><span className="track-no">01</span> About</p>
        <h2>Hey, I'm Aisha.</h2>
        <p className="lede">I'm a founder, writer and product-minded operator interested in how information becomes clearer, more useful and more human.</p>
        <p>By day, I work as a Founder's Associate across operations and executive priorities. Outside of work, I founded <a href="https://theoffscript.page" target="_blank" rel="noopener">The OffScript</a>, write about the ideas I can't leave alone, and make small internet products when I want something to exist.</p>
        <blockquote>“Make it easier to understand, use, or keep.”</blockquote>
        <Link className="text-link home-speaking-link" to="/speaking">See where I’m speaking →</Link>
      </div>

      <div className="about-playground">
        <div className="portrait-lenses" role="group" aria-label="Explore Aisha's portrait notes" onMouseLeave={() => setPreviewId(null)}>
          {lenses.map((lens) => {
            const selected = lens.id === selectedId;
            return (
              <button
                key={lens.id}
                type="button"
                className={selected ? "is-selected" : undefined}
                aria-pressed={selected}
                aria-controls="about-portrait-note"
                onMouseEnter={() => setPreviewId(lens.id)}
                onFocus={() => setPreviewId(lens.id)}
                onBlur={() => setPreviewId(null)}
                onClick={() => setSelectedId(lens.id)}
              >{lens.label}</button>
            );
          })}
        </div>
        <figure id="about-portrait-note" className={`portrait-note portrait-${active.id}`}>
          <span className="tape tape-left" aria-hidden="true" /><span className="tape tape-right" aria-hidden="true" />
          <div className="portrait-crop"><img src="/aisha-onola.jpeg" width="1122" height="1402" loading="lazy" alt="Black-and-white studio portrait of Aisha Onola" /></div>
          <figcaption className="handwritten" aria-live="polite">{active.caption}</figcaption>
          <p className="portrait-side-note" aria-live="polite">{active.note}</p>
        </figure>

        <div className="personal-status">
          <button type="button" onClick={() => setStatusIndex((statusIndex + 1) % personalStatus.length)} aria-label="Show another thing Aisha is doing">
            <span>What is Aisha doing?</span><b aria-hidden="true">↻</b>
          </button>
          <p aria-live="polite"><small>{status.label}</small>{status.value}</p>
        </div>
      </div>
    </div>
  );
}
