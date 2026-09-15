import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../data/content";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <Link className="brand-mark" to={location.pathname === "/" ? "/#top" : "/"} aria-label={location.pathname === "/" ? "Aisha Onola, back to top" : "Aisha Onola, back to home"}>A. Onola</Link>
      <button className="nav-toggle" type="button" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen((value) => !value)}>
        {open ? "Close" : "Menu"}
      </button>
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
