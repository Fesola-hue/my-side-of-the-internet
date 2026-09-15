import { useState } from "react";
import { speakingAppearances } from "../data/speaking";

export function AppearanceStage() {
  const [selectedId, setSelectedId] = useState(speakingAppearances[0].id);
  const selected = speakingAppearances.find((appearance) => appearance.id === selectedId) ?? speakingAppearances[0];
  const selectedIndex = speakingAppearances.indexOf(selected);

  return (
    <div className="appearance-stage">
      <div className="appearance-index" role="group" aria-label="Choose an upcoming appearance">
        {speakingAppearances.map((appearance, index) => {
          const active = appearance.id === selected.id;
          return (
            <button key={appearance.id} className={`appearance-option${active ? " is-active" : ""}`} type="button" aria-pressed={active} aria-controls="selected-appearance" onClick={() => setSelectedId(appearance.id)}>
              <span className="appearance-option-no">{String(index + 1).padStart(2, "0")}</span>
              <span><b>{appearance.organisation}</b>{appearance.programme && <small>{appearance.programme}</small>}</span>
              <span className="appearance-option-arrow" aria-hidden="true">{active ? "→" : "↘"}</span>
            </button>
          );
        })}
      </div>

      <article id="selected-appearance" className={`appearance-sheet${selectedIndex === 1 ? " is-galaxy" : ""}`} key={selected.id} aria-live="polite">
        <div className="appearance-sheet-top">
          <span>Upcoming appearance</span><span>{String(selectedIndex + 1).padStart(2, "0")} / {String(speakingAppearances.length).padStart(2, "0")}</span>
        </div>
        <div className="appearance-sheet-body">
          <p className="appearance-type">{selected.type}</p>
          <h3>{selected.organisation}</h3>
          {selected.programme && <p className="appearance-programme">{selected.programme}</p>}
          {selected.title && <p className="appearance-title">“{selected.title}”</p>}
          <p className="appearance-description">{selected.description}</p>
        </div>
        <div className="appearance-sheet-bottom"><span className="status-dot" aria-hidden="true" /> <span>{selected.status}</span><span className="handwritten">details soon</span></div>
      </article>
    </div>
  );
}
