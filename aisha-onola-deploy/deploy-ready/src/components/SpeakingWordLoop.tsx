import { useEffect, useState } from "react";

const words = ["Speaking", "Conversations", "Media", "Panels"];

export function SpeakingWordLoop() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let next = 0;
    const timer = window.setInterval(() => {
      next += 1;
      setIndex(next);
      if (next === words.length - 1) window.clearInterval(timer);
    }, 1900);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="speaking-word-loop">
      <span className="sr-only">Speaking, conversations, media and panels</span>
      <span key={words[index]} className="speaking-word" aria-hidden="true">{words[index]}</span>
      <span className="speaking-word-count" aria-hidden="true">0{index + 1} / 04</span>
    </div>
  );
}
