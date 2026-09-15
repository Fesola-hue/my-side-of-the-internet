import { FormEvent, RefObject, useEffect, useRef, useState } from "react";

type ContactRoomProps = {
  isOpen: boolean;
  onClose: () => void;
  pageRef: RefObject<HTMLDivElement | null>;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  defaultReason?: string;
};

const focusableSelector = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

export function ContactRoom({ isOpen, onClose, pageRef, returnFocusRef, defaultReason }: ContactRoomProps) {
  const roomRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const savedScrollRef = useRef(0);
  const bodyStylesRef = useRef<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      savedScrollRef.current = window.scrollY;
      setMounted(true);
      pageRef.current?.setAttribute("inert", "");
      bodyStylesRef.current = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        right: document.body.style.right,
        width: document.body.style.width,
        overflow: document.body.style.overflow,
      };
      document.body.style.position = "fixed";
      document.body.style.top = `-${savedScrollRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      return;
    }

    if (!mounted) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finish = () => {
      setMounted(false);
      setSuccess(false);
      setLeaving(false);
      setError("");
      setValidated(false);
      pageRef.current?.removeAttribute("inert");
      Object.entries(bodyStylesRef.current).forEach(([property, value]) => {
        document.body.style.setProperty(property, value);
      });
      window.scrollTo(0, savedScrollRef.current);
      returnFocusRef.current?.focus({ preventScroll: true });
    };
    const timer = window.setTimeout(finish, reduced ? 0 : 260);
    return () => window.clearTimeout(timer);
  }, [isOpen, pageRef, returnFocusRef]);

  useEffect(() => {
    if (!isOpen || !mounted) return;
    const frame = requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [isOpen, mounted]);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      abortRef.current?.abort();
      onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    setError("");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setSubmitting(true);
    abortRef.current = new AbortController();
    try {
      const response = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" }, signal: abortRef.current.signal });
      if (!response.ok) throw new Error("Submission failed");
      setLeaving(true);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.setTimeout(() => {
        setSuccess(true);
        setLeaving(false);
        requestAnimationFrame(() => successHeadingRef.current?.focus({ preventScroll: true }));
      }, reduced ? 0 : 180);
    } catch (caught) {
      if (!(caught instanceof DOMException && caught.name === "AbortError")) setError("Something went wrong while sending. Your message is still here—please try again.");
    } finally {
      abortRef.current = null;
      setSubmitting(false);
    }
  }

  function close() {
    abortRef.current?.abort();
    onClose();
  }

  if (!mounted) return null;
  return (
    <section
      ref={roomRef}
      className={`contact-room${isOpen ? " is-open" : ""}`}
      id="contact-room"
      role="dialog"
      aria-modal="true"
      aria-labelledby={success ? "contact-success-title" : "contact-title"}
      aria-describedby={success ? "contact-success-intro" : "contact-intro"}
      onKeyDown={(event) => {
        if (event.key === "Escape") { event.preventDefault(); close(); return; }
        if (event.key !== "Tab" || !roomRef.current) return;
        const focusable = [...roomRef.current.querySelectorAll<HTMLElement>(focusableSelector)].filter((element) => !element.closest("[hidden]"));
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}
    >
      <button ref={closeRef} className="contact-close" type="button" onClick={close} aria-label="Close contact screen"><span aria-hidden="true">←</span> Back</button>
      {!success && (
        <div className={`contact-form-view${leaving ? " is-leaving" : ""}`}>
          <div className="contact-room-inner">
            <header className="contact-room-heading">
              <p className="eyebrow"><span className="track-no" aria-hidden="true">A7</span> Contact</p>
              <h2 id="contact-title">Let’s make something useful.</h2>
              <p id="contact-intro">Got a role, project, collaboration, or something interesting in mind? Tell me a little about it.</p>
              <p className="contact-note handwritten" aria-hidden="true">good ideas welcome here →</p>
            </header>
            <div className="contact-form-area">
              <form className={`contact-form${validated ? " was-validated" : ""}`} action="https://formspree.io/f/mzeblevj" method="POST" noValidate aria-busy={submitting || undefined} onSubmit={submit}>
                <div className="form-field"><label htmlFor="contact-name">Name <span aria-hidden="true">*</span></label><input id="contact-name" name="name" type="text" autoComplete="name" required /></div>
                <div className="form-field"><label htmlFor="contact-email">Email <span aria-hidden="true">*</span></label><input id="contact-email" name="email" type="email" inputMode="email" autoComplete="email" required /></div>
                <div className="form-field"><label htmlFor="contact-reason">What are you reaching out about? <span aria-hidden="true">*</span></label><div className="select-wrap"><select id="contact-reason" name="reason" required defaultValue={defaultReason ?? ""}><option value="" disabled>Select one</option><option>Job opportunity</option><option>Freelance / project</option><option>Collaboration</option><option>Speaking / media</option><option>Something else</option></select></div></div>
                <div className="form-field"><label htmlFor="contact-message">Tell me a little more <span aria-hidden="true">*</span></label><textarea id="contact-message" name="message" rows={4} required /></div>
                <p className="form-error" role="alert" aria-live="assertive" tabIndex={-1} hidden={!error}>{error}</p>
                <button className="button button-gold contact-submit" type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send it ↗"}</button>
                <p className="contact-email-option">Prefer email? <a href="mailto:contact@aishaonola.me">contact@aishaonola.me</a></p>
              </form>
            </div>
          </div>
        </div>
      )}
      {success && (
        <div className="contact-success-view is-active" aria-live="polite">
          <div className="contact-success">
            <p className="success-mark handwritten" aria-hidden="true">sent!</p>
            <h2 ref={successHeadingRef} id="contact-success-title" tabIndex={-1}>Got it. I’ll get back to you soon :)</h2>
            <p id="contact-success-intro">In a hurry? You can also email me at <a href="mailto:contact@aishaonola.me">contact@aishaonola.me</a></p>
            <button className="contact-back-link" type="button" onClick={close}>Back to the site <span aria-hidden="true">←</span></button>
          </div>
        </div>
      )}
    </section>
  );
}
