// InitialsBadge.tsx

export default function InitialsBadge({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-md font-semibold text-text-foreground">
      {initials}
    </div>
  );
}