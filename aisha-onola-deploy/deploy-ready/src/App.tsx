import { useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ContactRoom } from "./components/ContactRoom";
import { RouteEffects } from "./components/RouteEffects";
import { Home } from "./pages/Home";
import { Speaking } from "./pages/Speaking";

export default function App() {
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactReason, setContactReason] = useState<string | undefined>();

  const openContact = (trigger: HTMLButtonElement, reason?: string) => {
    returnFocusRef.current = trigger;
    setContactReason(reason);
    setContactOpen(true);
  };

  return (
    <>
      <RouteEffects />
      <div key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home pageRef={pageRef} onOpenContact={openContact} />} />
          <Route path="/speaking" element={<Speaking pageRef={pageRef} onOpenContact={openContact} />} />
        </Routes>
      </div>
      <ContactRoom isOpen={contactOpen} onClose={() => setContactOpen(false)} pageRef={pageRef} returnFocusRef={returnFocusRef} defaultReason={contactReason} />
    </>
  );
}
