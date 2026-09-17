import { CSSProperties, useState } from "react";
import { writingPieces } from "../data/content";

export function WritingShelf() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [armedKey, setArmedKey] = useState<string | null>(null);
  const isTouchInput = () => window.matchMedia("(hover: none), (pointer: coarse)").matches;

  return (
    <div className="bookshelf-wrap wrap">
      <p className="shelf-hint handwritten">tap a spine to read the full title</p>
      <div className="bookshelf" aria-label="Four selected pieces of writing">
        {writingPieces.map((piece, index) => (
          <a
            key={piece.key}
            className={`book ${piece.className}${activeKey === piece.key ? " is-active" : ""}`}
            style={{ "--book-index": index } as CSSProperties}
            data-writing-key={piece.key}
            href={piece.href}
            target="_blank"
            rel="noopener"
            aria-describedby={`book-title-${index + 1}`}
            onMouseEnter={() => { if (!isTouchInput()) setActiveKey(piece.key); }}
            onFocus={() => setActiveKey(piece.key)}
            onClick={(event) => {
              if (!isTouchInput()) return;
              if (armedKey !== piece.key) {
                event.preventDefault();
                setActiveKey(piece.key);
                setArmedKey(piece.key);
              } else {
                setArmedKey(null);
              }
            }}
          >
            <span className="book-spine">{piece.shortTitle}</span><span className="book-number">{String(index + 1).padStart(2, "0")}</span>
          </a>
        ))}
        <div className="shelf" aria-hidden="true" />
      </div>
      <div className={`book-titles${activeKey ? " has-active" : ""}`} aria-live="polite">
        {writingPieces.map((piece, index) => (
          <p key={piece.key} id={`book-title-${index + 1}`} className={activeKey === piece.key ? "is-active" : undefined}>
            <b>{String(index + 1).padStart(2, "0")}</b> {piece.fullTitle}
          </p>
        ))}
      </div>
      <a className="text-link writing-home" href="https://read.aishaonola.me/" target="_blank" rel="noopener">Enter my writing space ↗</a>
    </div>
  );
}
