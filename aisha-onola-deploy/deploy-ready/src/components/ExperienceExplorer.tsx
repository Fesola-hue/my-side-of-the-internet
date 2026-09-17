import { useState } from "react";
import { experience } from "../data/content";

export function ExperienceExplorer() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const active = experience[selectedIndex];

  return (
    <div className="experience-explorer">
      <div className="experience-index" role="group" aria-label="Choose a work experience">
        {experience.map((item, index) => {
          const selected = index === selectedIndex;
          return (
            <button key={`${item.role}-${item.dateTime}`} type="button" aria-pressed={selected} aria-controls="active-experience" className={selected ? "is-selected" : undefined} onClick={() => setSelectedIndex(index)}>
              <time dateTime={item.dateTime}>{item.date}</time><b>{item.role}</b><span aria-hidden="true">{selected ? "—" : "+"}</span>
            </button>
          );
        })}
      </div>
      <article id="active-experience" className="experience-detail" key={active.role} aria-live="polite">
        <p className="mono-note">Selected experience · {String(selectedIndex + 1).padStart(2, "0")}</p>
        <h3>{active.role}</h3><p className="org">{active.org}</p><p>{active.detail}</p>
      </article>
    </div>
  );
}
