import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../data/content";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", open);
    if (open) requestAnimationFrame(() => navRef.current?.querySelector<HTMLAnchorElement>("#nav-links a")?.focus());
    return () => document.body.classList.remove("mobile-menu-open");
  }, [open]);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      requestAnimationFrame(() => toggleRef.current?.focus());
      return;
    }
    if (event.key !== "Tab" || !navRef.current) return;
    const items = [...navRef.current.querySelectorAll<HTMLElement>("button:not([disabled]):not([tabindex='-1']), a[href]")].filter((item) => getComputedStyle(item).visibility !== "hidden");
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }

  return (
    <nav ref={navRef} className={`site-nav${open ? " is-open" : ""}`} aria-label="Primary navigation" onKeyDown={handleKeyDown}>
      <Link className="brand-mark" to={location.pathname === "/" ? "/#top" : "/"} aria-label={location.pathname === "/" ? "Aisha Onola, back to top" : "Aisha Onola, back to home"}>A. Onola</Link>
      <button ref={toggleRef} className="nav-toggle" type="button" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen((value) => !value)}>
        {open ? "Close" : "Menu"}
      </button>
      <button className="nav-backdrop" type="button" tabIndex={-1} aria-label="Close menu" onClick={() => setOpen(false)} />
      <ul id="nav-links" className={open ? "is-open" : undefined} onClick={(event) => {
        if ((event.target as HTMLElement).closest("a")) setOpen(false);
      }}>
        {navItems.map(([label, href]) => {
          const destination = href.startsWith("#") && location.pathname !== "/" ? `/${href}` : href;
          const active = href === "/speaking" && location.pathname.startsWith("/speaking");
          return <li key={href}><Link to={destination} aria-current={active ? "page" : undefined}>{label}</Link></li>;
        })}
      </ul>
    </nav>
  );
}
