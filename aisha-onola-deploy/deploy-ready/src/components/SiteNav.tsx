import { useState } from "react";
import { navItems } from "../data/content";

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <a className="brand-mark" href="#top" aria-label="Aisha Onola, back to top">A. Onola</a>
      <button className="nav-toggle" type="button" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen((value) => !value)}>
        {open ? "Close" : "Menu"}
      </button>
      <ul id="nav-links" className={open ? "is-open" : undefined} onClick={(event) => {
        if ((event.target as HTMLElement).closest("a")) setOpen(false);
      }}>
        {navItems.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}
      </ul>
    </nav>
  );
}
