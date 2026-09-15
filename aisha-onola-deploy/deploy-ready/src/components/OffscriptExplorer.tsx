import { useState } from "react";
import { offscriptSections } from "../data/content";

export function OffscriptExplorer() {
  const [selectedId, setSelectedId] = useState(offscriptSections[0].id);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const active = offscriptSections.find((item) => item.id === (previewId ?? selectedId)) ?? offscriptSections[0];
  const activeIndex = offscriptSections.indexOf(active);

  return (
    <div className="offscript-explorer">
      <div className="offscript-index" role="group" aria-label="Explore recurring sections in The OffScript" onMouseLeave={() => setPreviewId(null)}>
        {offscriptSections.map((item, index) => {
          const selected = item.id === selectedId;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              aria-controls="offscript-preview"
              className={selected ? "is-selected" : undefined}
              onMouseEnter={() => setPreviewId(item.id)}
              onFocus={() => setPreviewId(item.id)}
              onBlur={() => setPreviewId(null)}
              onClick={() => setSelectedId(item.id)}
            data-note={item.note ?? "Read less. Understand more."}
            >
              <span>{String(index + 1).padStart(2, "0")}</span><b>{item.label}</b><i aria-hidden="true">{selected ? "—" : "+"}</i>
            </button>
          );
        })}
      </div>
      <article id="offscript-preview" className={`offscript-preview accent-${active.accent}`} key={active.id} aria-live="polite">
        <div className="offscript-preview-top"><span>Inside every issue</span><span>{String(activeIndex + 1).padStart(2, "0")} / {String(offscriptSections.length).padStart(2, "0")}</span></div>
        <div className="offscript-preview-body">
          <p className="offscript-preview-mark">THE<br />OFF<br />SCRIPT</p>
          <div><p className="mono-note">Selected section</p><h3>{active.label}</h3><p>{active.note ?? "Read less. Understand more."}</p></div>
        </div>
      </article>
    </div>
  );
}
