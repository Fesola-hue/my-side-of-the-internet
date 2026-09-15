import { useEffect } from "react";

type PageMetadata = {
  title: string;
  description: string;
  canonical: string;
  image: string;
};

const selectors = {
  description: 'meta[name="description"]',
  canonical: 'link[rel="canonical"]',
  ogTitle: 'meta[property="og:title"]',
  ogDescription: 'meta[property="og:description"]',
  ogImage: 'meta[property="og:image"]',
  ogUrl: 'meta[property="og:url"]',
  twitterTitle: 'meta[name="twitter:title"]',
  twitterDescription: 'meta[name="twitter:description"]',
  twitterImage: 'meta[name="twitter:image"]',
} as const;

function ensureElement(selector: string, tag: "meta" | "link", attributes: Record<string, string>) {
  const existing = document.head.querySelector<HTMLElement>(selector);
  if (existing) return { element: existing, created: false };
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  document.head.append(element);
  return { element, created: true };
}

export function usePageMetadata(metadata: PageMetadata): void {
  useEffect(() => {
    const previousTitle = document.title;
    const values = [
      [selectors.description, "meta", { name: "description" }, metadata.description],
      [selectors.canonical, "link", { rel: "canonical" }, metadata.canonical],
      [selectors.ogTitle, "meta", { property: "og:title" }, metadata.title],
      [selectors.ogDescription, "meta", { property: "og:description" }, metadata.description],
      [selectors.ogImage, "meta", { property: "og:image" }, metadata.image],
      [selectors.ogUrl, "meta", { property: "og:url" }, metadata.canonical],
      [selectors.twitterTitle, "meta", { name: "twitter:title" }, metadata.title],
      [selectors.twitterDescription, "meta", { name: "twitter:description" }, metadata.description],
      [selectors.twitterImage, "meta", { name: "twitter:image" }, metadata.image],
    ] as const;
    const touched = values.map(([selector, tag, attributes, value]) => {
      const item = ensureElement(selector, tag, attributes);
      const attribute = tag === "link" ? "href" : "content";
      const previous = item.element.getAttribute(attribute);
      item.element.setAttribute(attribute, value);
      return { ...item, attribute, previous };
    });
    document.title = metadata.title;

    const structuredData = document.createElement("script");
    structuredData.type = "application/ld+json";
    structuredData.dataset.routeMetadata = "speaking";
    structuredData.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: metadata.title,
      description: metadata.description,
      url: metadata.canonical,
      about: { "@id": "https://aishaonola.me/#aisha-onola" },
    });
    document.head.append(structuredData);

    return () => {
      document.title = previousTitle;
      structuredData.remove();
      touched.forEach(({ element, created, attribute, previous }) => {
        if (created) element.remove();
        else if (previous === null) element.removeAttribute(attribute);
        else element.setAttribute(attribute, previous);
      });
    };
  }, [metadata.canonical, metadata.description, metadata.image, metadata.title]);
}
