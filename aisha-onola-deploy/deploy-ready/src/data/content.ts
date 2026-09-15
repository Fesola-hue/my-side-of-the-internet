export type WritingPiece = {
  key: string;
  shortTitle: string;
  fullTitle: string;
  href: string;
  className: string;
};

export type Project = {
  name: string;
  description: string;
  roles: string;
  href?: string;
  linkLabel?: string;
  image?: { src: string; width: number; height: number; alt: string };
  mediaClass: string;
};

export type OffscriptSection = {
  id: string;
  label: string;
  accent: "gold" | "blue" | "red" | "cream";
  note?: string;
};

export type PersonalStatus = { label: string; value: string };

export const navItems = [
  ["About", "#about"],
  ["Writing", "#writing"],
  ["OffScript", "#offscript"],
  ["Built", "#built"],
  ["Work", "#work"],
  ["Speaking", "/speaking"],
] as const;

export const writingPieces: WritingPiece[] = [
  {
    key: "world-bigger",
    shortTitle: "My world, a little bigger",
    fullTitle: "People who made my world a little bigger❤️",
    href: "https://read.aishaonola.me/writing/people-who-made-my-world/",
    className: "book-personal book-one",
  },
  {
    key: "dating-myself",
    shortTitle: "Dating myself",
    fullTitle: "So, I started dating myself",
    href: "https://read.aishaonola.me/writing/so-i-started-dating-myself/",
    className: "book-personal book-two",
  },
  {
    key: "ai-ownership",
    shortTitle: "AI & ownership",
    fullTitle: "Nigeria Doesn't Have an AI Problem. It Has an Ownership Problem.",
    href: "https://read.aishaonola.me/writing/offscript-004-nigeria-doesn-t-have-an-ai-problem-it-has-an-ownership-problem/",
    className: "book-offscript book-three",
  },
  {
    key: "own-anything",
    shortTitle: "Who gets to own?",
    fullTitle: "Three companies are quietly deciding if our generation ever owns anything.",
    href: "https://read.aishaonola.me/offscript/",
    className: "book-offscript book-four",
  },
];

export const projects: Project[] = [
  {
    name: "STILLcam",
    description: "Turn a few photos into little memory objects.",
    roles: "Concept · Product · Design · Build",
    href: "https://stillcam.vercel.app",
    linkLabel: "Make a memory ↗",
    image: { src: "/assets/screenshots/stillcam-desktop.png", width: 1440, height: 1100, alt: "Full desktop viewport of STILLcam" },
    mediaClass: "project-media-landscape",
  },
  {
    name: "The OffScript Check",
    description: "A two-minute interactive check of what you actually know about the news.",
    roles: "Concept · Editorial · Product · Build",
    href: "https://check.theoffscript.page",
    linkLabel: "Take the Check ↗",
    image: { src: "/assets/screenshots/check-desktop.png", width: 1440, height: 900, alt: "Full viewport of The OffScript Check landing screen" },
    mediaClass: "project-media-tall",
  },
  {
    name: "Aisha's Writing Space",
    description: "A home for the things I write, from personal essays to reported stories.",
    roles: "Creative direction · Editorial · Design · Build",
    href: "https://read.aishaonola.me/",
    linkLabel: "Enter ↗",
    image: { src: "/assets/screenshots/writing-desktop.png", width: 1440, height: 900, alt: "Full desktop viewport of Aisha's writing space" },
    mediaClass: "project-media-landscape",
  },
  {
    name: "aishaonola.me",
    description: "My little corner of the internet. You're already here.",
    roles: "Design · Build",
    mediaClass: "project-media-wide",
  },
];

export const offscriptSections: OffscriptSection[] = [
  { id: "main-character", label: "Main Character", accent: "gold", note: "The person, place or idea at the centre." },
  { id: "paper-trail", label: "The Paper Trail", accent: "red", note: "One stat worth knowing." },
  { id: "soundtrack", label: "Soundtrack", accent: "blue", note: "Music that fits the mood." },
  { id: "side-quests", label: "Side Quests", accent: "cream", note: "The context just outside the main story." },
  { id: "word-market", label: "Word Market", accent: "gold", note: "A useful phrase, term or idea to keep." },
  { id: "rabbit-hole", label: "Rabbit Hole", accent: "blue", note: "A lead for when one question becomes three." },
  { id: "your-turn", label: "Your Turn", accent: "red", note: "A question to take with you." },
];

export const personalStatus: PersonalStatus[] = [
  { label: "building", value: "The OffScript" },
  { label: "writing", value: "Ideas I can’t leave alone" },
  { label: "working", value: "Founder’s Associate" },
];

export const experience = [
  {
    date: "Nov '25 to present",
    dateTime: "2025-11",
    role: "Founder's Associate",
    org: "HRA Systems · Remote",
    detail: "I work close to the founder across research, operations and new initiatives. I turn market, competitor and opportunity research into useful briefs and recommendations, take on projects that don’t come with a playbook, and build the docs and systems that keep the work organised. I’ve also supported hiring, from candidate coordination through onboarding.",
  },
  {
    date: "Jul '25 to present",
    dateTime: "2025-07",
    role: "The OffScript",
    org: "Founder & Editor · Remote",
    detail: "I founded and run a digital media publication for young Nigerians, handling everything from research and writing to publishing, the website and GTM. It grew to 100+ subscribers in its first few weeks through direct outreach and partnerships, and I use audience and campaign data to figure out what’s working, where to reach people and what to try next.",
  },
  {
    date: "Jul '25 to Oct '25",
    dateTime: "2025-07",
    role: "Proten International",
    org: "Outsourcing Intern · Hybrid",
    detail: "I worked on the people and processes behind outsourced staffing, supporting recruitment, onboarding and workforce admin across Zoho and SeamlessHR. I was also a day-to-day contact for outsourced employees, helping sort operational issues and keep onboarding on track.",
  },
];

export const socialLinks = [
  { name: "LinkedIn", note: "work & thoughts", href: "https://www.linkedin.com/in/aishaonola" },
  { name: "Instagram", note: "life & moments", href: "https://instagram.com/aishaa_fesola" },
  { name: "X", note: "ideas & opinions", href: "https://x.com/aishaonola" },
  { name: "GitHub", note: "code & experiments", href: "https://github.com/Fesola-hue" },
  { name: "Email", note: "contact@aishaonola.me", href: "mailto:contact@aishaonola.me" },
];

export const heroTicker = ["Founder", "Writer", "Media builder", "Product-minded operator"];
export const skillsTicker = ["Founder's Associate", "Business Operations", "Project Coordination", "Research", "Stakeholder Communication", "Executive Support", "Workflow Management", "Writing", "Editorial", "Product Thinking"];
