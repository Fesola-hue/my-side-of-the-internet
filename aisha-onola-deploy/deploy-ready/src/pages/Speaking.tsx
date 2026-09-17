import { RefObject } from "react";
import { AppearanceStage } from "../components/AppearanceStage";
import { SiteNav } from "../components/SiteNav";
import { SpeakingWordLoop } from "../components/SpeakingWordLoop";
import { TopicExplorer } from "../components/TopicExplorer";
import { usePageMetadata } from "../hooks/usePageMetadata";

type SpeakingProps = {
  pageRef: RefObject<HTMLDivElement | null>;
  onOpenContact: (trigger: HTMLButtonElement, reason?: string) => void;
};

const metadata = {
  title: "Speaking | Aisha Onola",
  description: "Aisha Onola speaks about nonlinear careers, building on the internet, young people and technology, writing, media and AI for builders.",
  canonical: "https://aishaonola.me/speaking",
  image: "https://aishaonola.me/og-image.png",
};

export function Speaking({ pageRef, onOpenContact }: SpeakingProps) {
  usePageMetadata(metadata);

  return (
    <div ref={pageRef} className="speaking-page route-view">
      <a className="skip-link" href="#speaking-main">Skip to content</a>
      <div className="grain" aria-hidden="true" />
      <SiteNav />
      <main id="speaking-main" tabIndex={-1}>
        <header className="speaking-hero">
          <div className="wrap speaking-hero-inner">
            <div className="speaking-hero-label"><p className="eyebrow"><span className="track-no">A2</span> Speaking room</p><SpeakingWordLoop /></div>
            <div className="speaking-hero-copy">
              <h1>I talk about work, tech, media and figuring things out as I go.</h1>
              <p>Conversations about building a career, making things on the internet, young people and technology, and everything I’m still learning along the way.</p>
            </div>
            <a className="speaking-scroll-cue" href="#appearances">What’s coming up <span aria-hidden="true">↓</span></a>
          </div>
        </header>

        <section className="speaking-appearances" id="appearances">
          <div className="wrap">
            <div className="speaking-section-head">
              <p className="eyebrow"><span className="track-no">01</span> On the calendar</p>
              <div><h2>A small calendar, kept current.</h2><p>Upcoming appearances, past conversations, and room for the next good invitation.</p></div>
            </div>
            <AppearanceStage />
          </div>
        </section>

        <section className="speaking-topics" id="topics">
          <div className="wrap">
            <div className="speaking-section-head speaking-topics-head">
              <p className="eyebrow"><span className="track-no">02</span> Things we could talk about</p>
              <div><h2>A working list, not a keynote menu.</h2><p>These are the conversations I keep returning to.</p></div>
            </div>
            <TopicExplorer />
          </div>
        </section>

        <section className="speaking-invitation" id="invite">
          <div className="wrap speaking-invitation-inner">
            <p className="eyebrow"><span className="track-no">03</span> Your turn</p>
            <h2>Got something you think I’d be good for?</h2>
            <p>I’m open to panels, community conversations, workshops, podcasts, media appearances and the occasional room where I have to hold a microphone and pretend I’m not nervous.</p>
            <button className="button button-gold contact-trigger" type="button" onClick={(event) => onOpenContact(event.currentTarget, "Speaking / media")}>Invite me to speak <span aria-hidden="true">→</span></button>
          </div>
        </section>
      </main>
      <footer className="speaking-footer"><span>© 2026 Aisha Onola · Lagos, Nigeria</span><span className="footer-center"><a href="#speaking-main">Back to the top ↑</a></span><span className="footer-right"><span className="open-to-work">Open to conversations</span></span></footer>
    </div>
  );
}
