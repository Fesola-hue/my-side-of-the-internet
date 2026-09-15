import { useState } from "react";
import { speakingTopics } from "../data/speaking";

export function TopicExplorer() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = speakingTopics.find((topic) => topic.id === selectedId) ?? speakingTopics[0];
  const selectedIndex = speakingTopics.indexOf(selected);

  return (
    <div className="topic-explorer">
      <div className="topic-index" role="group" aria-label="Explore speaking topics">
        {speakingTopics.map((topic, index) => {
          const active = topic.id === selectedId;
          return <div key={topic.id} className={`topic-row${active ? " is-active" : ""}`}>
            <button className={active ? "is-active" : undefined} type="button" aria-pressed={active} aria-controls="selected-topic" onClick={() => setSelectedId(topic.id)}>
              <span>{String(index + 1).padStart(2, "0")}</span><b>{topic.title}</b><span aria-hidden="true">{active ? "—" : "+"}</span>
            </button>
            <div className="topic-inline-detail" aria-hidden={!active}><p>{topic.description}</p><span className="topic-inline-scribble handwritten" aria-hidden="true">let’s unpack it!</span></div>
          </div>;
        })}
      </div>
      <div id="selected-topic" className="topic-detail" key={selected.id} aria-live="polite">
        <span className="topic-detail-no">Theme {String(selectedIndex + 1).padStart(2, "0")}</span>
        <h3>{selected.title}</h3>
        <p>{selected.description}</p>
        <span className="topic-scribble handwritten" aria-hidden="true">let’s unpack it!</span>
      </div>
    </div>
  );
}
