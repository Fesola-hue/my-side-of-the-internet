import { RefObject } from "react";
import { Hero } from "../components/Hero";
import { SiteNav } from "../components/SiteNav";
import { WritingShelf } from "../components/WritingShelf";
import { MarqueeText } from "../components/MarqueeText";
import { OffscriptExplorer } from "../components/OffscriptExplorer";
import { experience, projects, skillsTicker, socialLinks } from "../data/content";

type HomeProps = {
  pageRef: RefObject<HTMLDivElement | null>;
  onOpenContact: (trigger: HTMLButtonElement) => void;
};

export function Home({ pageRef, onOpenContact }: HomeProps) {
  return (
    <div ref={pageRef}>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="grain" aria-hidden="true" />
      <SiteNav />
      <Hero onOpenContact={onOpenContact} />

      <main id="main">
        <section className="about section reveal" id="about">
          <div className="wrap about-grid">
            <div className="about-copy">
              <p className="eyebrow"><span className="track-no">01</span> About</p>
              <h2>Hey, I'm Aisha.</h2>
              <p className="lede">I'm a founder, writer and product-minded operator interested in how information becomes clearer, more useful and more human.</p>
              <p>By day, I work as a Founder's Associate across operations and executive priorities. Outside of work, I founded <a href="https://theoffscript.page" target="_blank" rel="noopener">The OffScript</a>, write about the ideas I can't leave alone, and make small internet products when I want something to exist.</p>
              <blockquote>"Make it easier to understand, use, or keep."</blockquote>
              <a className="text-link home-speaking-link" href="/speaking">See where I’m speaking →</a>
            </div>
            <figure className="portrait-note">
              <span className="tape tape-left" aria-hidden="true" /><span className="tape tape-right" aria-hidden="true" />
              <img src="/aisha-onola.jpeg" width="1122" height="1402" loading="lazy" alt="Black-and-white studio portrait of Aisha Onola" />
              <figcaption className="handwritten">in my serious era</figcaption>
            </figure>
          </div>
        </section>

        <section className="writing section world-reveal reveal-shelf" id="writing">
          <div className="wrap compact-head">
            <div><p className="eyebrow"><span className="track-no">02</span> Writing</p><h2>Things I've been thinking about.</h2></div>
            <p>Personal essays, reported stories, and the occasional thought that became too loud to keep in my notes app.</p>
          </div>
          <WritingShelf />
        </section>

        <section className="offscript section reveal" id="offscript">
          <div className="wrap">
            <div className="offscript-title-row">
              <div><p className="eyebrow"><span className="track-no">03</span> The flagship</p><h2>The OffScript</h2></div>
              <p className="mono-note">Founded 2026 · Lagos, everywhere</p>
            </div>
            <div className="offscript-layout">
              <div className="offscript-story">
                  <p className="offscript-kicker">Read less. Understand more.</p>
                  <p>The OffScript is an independent media project I founded for curious Nigerians who want the news straight and the context real. Every week, I shape the editorial direction, write and edit the stories, and turn the biggest conversations in politics, money, technology and culture into something people can actually use.</p>
                  <div className="button-row">
                    <a className="button button-gold" href="https://theoffscript.page" target="_blank" rel="noopener">Read The OffScript ↗</a>
                    <a className="button button-ghost" href="https://check.theoffscript.page" target="_blank" rel="noopener">Take the Dossier ↗</a>
                  </div>
                </div>
              <div className="issue-stack" aria-label="What The OffScript contains">
                <div className="issue issue-back"><span>Music that fits the mood</span><b>THE SOUNDTRACK</b></div>
                <div className="issue issue-mid"><span>One stat worth knowing</span><b>THE PAPER TRAIL</b></div>
                <div className="issue issue-front"><span>Inside every issue</span><b>POWER<br />MONEY<br />TECH</b><em>Culture, too.<br />Explained.</em></div>
              </div>
              <p className="offscript-prompt handwritten">what's in every issue ↓</p>
              <OffscriptExplorer />
            </div>
          </div>
        </section>

        <section className="built section reveal" id="built">
          <div className="wrap">
            <div className="built-head">
              <div className="built-eyebrow"><p className="eyebrow"><span className="track-no">04</span> Selected work</p></div>
              <h2>Things I've Shipped</h2>
              <p>A few ideas I took from thought to live URL.</p>
            </div>
            <div className="project-rail">
              {projects.map((project, index) => (
                <article className="project" key={project.name}>
                  <div className={`project-media ${project.mediaClass}`}>
                    {project.image ? <img {...project.image} loading="lazy" /> : <div className="you-are-here-wrap"><span className="you-are-here-domain">aishaonola.me</span><span className="you-are-here-dot">●</span><span className="you-are-here-label">you are here :)</span></div>}
                  </div>
                  <div className="project-copy"><span className="project-no">{String(index + 1).padStart(2, "0")}</span><h3>{project.name}</h3><p>{project.description}</p><small>{project.roles}</small>{project.href && <a className="text-link" href={project.href} target="_blank" rel="noopener">{project.linkLabel}</a>}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="work section reveal" id="work">
          <div className="skills-ticker" aria-hidden="true"><div><MarqueeText items={skillsTicker} /></div></div>
          <div className="wrap">
            <div className="work-head">
              <div><p className="eyebrow"><span className="track-no">05</span> Work</p><h2>The professional bit.</h2></div>
              <p>I work close to founders, make sense of messy work, and build the systems that help good ideas keep moving. The short version is here; the full detail lives in my CV.</p>
            </div>
            <ol className="credits">
              {experience.map((item) => <li key={item.role}><time dateTime={item.dateTime}>{item.date}</time><div><h3>{item.role}</h3><p className="org">{item.org}</p><p>{item.detail}</p></div></li>)}
            </ol>
            <div className="button-row work-buttons">
              <a className="button button-gold" href="/Aisha_Fesola_Onola_Resume.pdf" target="_blank" rel="noopener">View my CV ↗</a>
              <a className="button button-ghost" href="https://www.linkedin.com/in/aishaonola" target="_blank" rel="noopener">Connect on LinkedIn ↗</a>
            </div>
            <div className="work-contact"><span className="handwritten" aria-hidden="true">your turn.</span><button className="button button-gold contact-trigger" type="button" onClick={(event) => onOpenContact(event.currentTarget)}>Have something in mind? <span aria-hidden="true">↗</span></button></div>
          </div>
        </section>

        <section className="links section world-reveal reveal-links" id="links">
          <div className="wrap">
            <p className="eyebrow"><span className="track-no">06</span> Everywhere else</p>
            <h2>Find me around the internet.</h2>
            <div className="link-list">
              {socialLinks.map((link) => <a key={link.name} href={link.href} {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}><span>{link.name}</span><small>{link.note}</small><b>↗</b></a>)}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <span>© 2026 Aisha Onola · Lagos, Nigeria</span>
        <span className="footer-center"><a href="#top">Back to the top ↑</a></span>
        <span className="footer-right"><span className="open-to-work">Open to work</span></span>
      </footer>
    </div>
  );
}
