export type AppearanceStatus = "upcoming" | "past";
export type AppearanceLink = { label: string; href: string };

export type SpeakingAppearance = {
  id: string;
  slug: string;
  organisation: string;
  programme?: string;
  title?: string;
  type: "Community Session" | "Television Appearance" | "Panel" | "Workshop" | "Podcast" | "Media Appearance";
  location?: string;
  date?: string;
  status: AppearanceStatus;
  description: string;
  image?: { src: string; alt: string };
  links?: AppearanceLink[];
  recording?: AppearanceLink;
  photos?: AppearanceLink[];
  slides?: AppearanceLink;
  reflection?: string;
};

export type SpeakingTopic = {
  id: string;
  title: string;
  description: string;
};

export const speakingAppearances: SpeakingAppearance[] = [
  {
    id: "sca-lagos-career-in-tech",
    slug: "she-code-africa-lagos-career-in-tech",
    organisation: "She Code Africa Lagos",
    title: "Building a Career in Tech When You Don’t Have It All Figured Out",
    type: "Community Session",
    status: "upcoming",
    description: "A conversation about trying different paths, building skills across disciplines, and creating a career while you’re still figuring out what you want yours to look like.",
  },
  {
    id: "galaxy-television-womens-corner",
    slug: "galaxy-television-womens-corner",
    organisation: "Galaxy Television",
    programme: "Women’s Corner",
    type: "Television Appearance",
    status: "upcoming",
    description: "An upcoming appearance on Women’s Corner. The conversation is still taking shape, so I’ll share more when it’s confirmed.",
  },
];

export const getSpeakingAppearanceBySlug = (slug: string) => speakingAppearances.find((appearance) => appearance.slug === slug);

export const speakingTopics: SpeakingTopic[] = [
  { id: "nonlinear-careers", title: "Careers without a straight line", description: "Trying different paths, changing direction, building skills and figuring out where you fit." },
  { id: "building-online", title: "Building things on the internet", description: "Side projects, media projects and turning small ideas into real things before feeling completely ready." },
  { id: "young-people-tech", title: "Young people + technology", description: "How young people, particularly young Nigerians, use, understand and are affected by technology." },
  { id: "writing-media", title: "Writing, media + the internet", description: "Making information understandable, writing for young audiences and building media online." },
  { id: "ai-builders", title: "AI as a tool for builders", description: "Using AI to move from idea to something real and how these tools are changing who gets to build." },
];
