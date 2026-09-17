import { useState } from "react";
import { speakingAppearances } from "../data/speaking";

export function AppearanceStage() {
  const [showPast, setShowPast] = useState(false);
  const now = new Date();
  const upcomingAppearances = speakingAppearances.filter((appearance) => new Date(appearance.dateTime) >= now);
  const pastAppearances = speakingAppearances.filter((appearance) => new Date(appearance.dateTime) < now);
  const visibleAppearances = showPast ? pastAppearances : upcomingAppearances;

  return (
    <div id="selected-appearance" className="appearance-calendar" aria-live="polite">
      {visibleAppearances.length > 0 ? visibleAppearances.map((appearance) => {
        const isPast = new Date(appearance.dateTime) < now;
        return (
          <article className={`appearance-card${isPast ? " is-past" : ""}`} key={appearance.id}>
            <figure className="appearance-poster">
              <img src="/SCA-Speaker-flyer.jpeg" alt="She Code Africa Lagos Community Growth Series flyer featuring Aisha Onola" width="864" height="1080" />
              <figcaption>Community Growth Series</figcaption>
            </figure>
            <div className="appearance-card-content">
              <div className="appearance-sheet-top"><span>{isPast ? "Past appearance" : "Next appearance"}</span><span>{appearance.type}</span></div>
              <div className="appearance-card-brief">
                <h3>{appearance.organisation}</h3>
                <p className="appearance-card-date">{appearance.date}{appearance.location && ` · ${appearance.location}`}</p>
              </div>
              <details className="appearance-more">
                <summary>More event details <span aria-hidden="true">+</span></summary>
                <div className="appearance-sheet-body">
                  {appearance.title && <p className="appearance-title">“{appearance.title}”</p>}
                  <p className="appearance-description">{appearance.description}</p>
                  <dl className="appearance-details">
                    {appearance.date && <div><dt>Date</dt><dd>{appearance.date}</dd></div>}
                    {appearance.time && <div><dt>Time</dt><dd>{appearance.time}</dd></div>}
                    {appearance.location && <div><dt>Where</dt><dd>{appearance.location}</dd></div>}
                  </dl>
                </div>
              </details>
              <div className="appearance-sheet-bottom"><span className="status-dot" aria-hidden="true" /> <span>{isPast ? "completed" : "upcoming"}</span></div>
            </div>
          </article>
        );
      }) : (
        <div className="appearance-empty">
          <span className="appearance-empty-mark" aria-hidden="true">✳</span>
          <p className="appearance-type">The calendar is quiet</p>
          <h3>No upcoming appearances right now.</h3>
          <p>Want to put something good on the calendar?</p>
          <a className="button button-gold" href="#invite">Invite me to speak <span aria-hidden="true">→</span></a>
        </div>
      )}

      {pastAppearances.length > 0 && <button className="appearance-toggle" type="button" onClick={() => setShowPast((current) => !current)}>{showPast ? "Back to upcoming" : `View past event${pastAppearances.length === 1 ? "" : "s"}`} <span aria-hidden="true">{showPast ? "↗" : "↓"}</span></button>}
    </div>
  );
}
