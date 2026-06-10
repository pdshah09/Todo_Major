// InitialsBadge.tsx

export default function InitialsBadge({ name }: { name: string }) {
  // 1. Extract up to 2 initials
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // 2. Generate a deterministic number based on the characters in the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // 3. Convert hash to a 360-degree Hue. 
  // Saturation at 95% and Lightness at 65% guarantees a bright, fluorescent brand-like color.
  const hue = Math.abs(hash) % 360;
  const fluorescentBg = `hsl(${hue}, 95%, 65%)`;

  return (
    <div
      className="flex size-8 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm"
      style={{ backgroundColor: fluorescentBg }}
      title={name}
    >
      {initials}
    </div>
  );
}