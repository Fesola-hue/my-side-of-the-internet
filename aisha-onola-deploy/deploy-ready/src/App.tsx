import { useRef, useState } from "react";
import { ContactRoom } from "./components/ContactRoom";
import { useRevealAnimations } from "./hooks/useRevealAnimations";
import { Home } from "./pages/Home";

export default function App() {
  const pageRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement>(null);
  const [contactOpen, setContactOpen] = useState(false);
  useRevealAnimations();

  return (
    <>
      <Home pageRef={pageRef} onOpenContact={(trigger) => { returnFocusRef.current = trigger; setContactOpen(true); }} />
      <ContactRoom isOpen={contactOpen} onClose={() => setContactOpen(false)} pageRef={pageRef} returnFocusRef={returnFocusRef} />
    </>
  );
}
