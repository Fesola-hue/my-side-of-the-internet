import { CSSProperties, PointerEvent, useState } from "react";
import { projects } from "../data/content";

export function ProjectExplorer() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const activeIndex = previewIndex ?? selectedIndex;
  const active = projects[activeIndex];

  function tilt(event: PointerEvent<HTMLElement>) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
    event.currentTarget.style.setProperty("--project-tilt-x", `${(-y * 1.2).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--project-tilt-y", `${(x * 1.5).toFixed(2)}deg`);
  }

  function resetTilt(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.removeProperty("--project-tilt-x");
    event.currentTarget.style.removeProperty("--project-tilt-y");
  }

  return (
    <div className="project-explorer" onMouseLeave={() => setPreviewIndex(null)}>
      <div className="project-index" role="group" aria-label="Choose a project">
        {projects.map((project, index) => {
          const selected = index === selectedIndex;
          return (
            <button
              key={project.name}
              type="button"
              className={selected ? "is-selected" : undefined}
              aria-pressed={selected}
              aria-controls="active-project"
              onMouseEnter={() => setPreviewIndex(index)}
              onFocus={() => setPreviewIndex(index)}
              onBlur={() => setPreviewIndex(null)}
              onClick={() => setSelectedIndex(index)}
            ><span>{String(index + 1).padStart(2, "0")}</span><b>{project.name}</b><i aria-hidden="true">{selected ? "→" : "↘"}</i></button>
          );
        })}
      </div>

      <article id="active-project" className="project-stage" key={active.name} aria-live="polite" onPointerMove={tilt} onPointerLeave={resetTilt} style={{ "--project-index": activeIndex } as CSSProperties}>
        <div className={`project-stage-media ${active.mediaClass}`}>
          <span className="project-browser-bar" aria-hidden="true"><i /><i /><i /><b>{active.href?.replace(/^https?:\/\//, "") ?? "aishaonola.me"}</b></span>
          {active.image ? <img {...active.image} loading="lazy" /> : (
            <div className="you-are-here-wrap"><span className="you-are-here-domain">aishaonola.me</span><span className="you-are-here-dot">●</span><span className="you-are-here-label">you are here :)</span></div>
          )}
        </div>
        <div className="project-stage-copy">
          <span className="project-no">PROJECT {String(activeIndex + 1).padStart(2, "0")}</span>
          <h3>{active.name}</h3><p>{active.description}</p><small>{active.roles}</small>
          {active.href && <a className="text-link" href={active.href} target="_blank" rel="noopener">{active.linkLabel}</a>}
        </div>
      </article>
    </div>
  );
}
