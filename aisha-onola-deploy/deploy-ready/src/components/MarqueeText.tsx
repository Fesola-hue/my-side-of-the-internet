type MarqueeTextProps = { items: readonly string[] };

export function MarqueeText({ items }: MarqueeTextProps) {
  return <>{[...items, ...items].map((item, index) => <span key={`${item}-${index}`}>{item} <i>✦</i> </span>)}</>;
}
