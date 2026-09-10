import { cn } from "@/lib/utils";

/** Decorative CSS marquee — aria-hidden, pauses on hover, off under reduced motion. */
export function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const doubled = [...items, ...items];

  return (
    <div
      aria-hidden
      className={cn(
        "group relative overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:[mask-image:none]",
        className,
      )}
    >
      <div className="marquee-track flex w-max items-center gap-12 whitespace-nowrap motion-reduce:transform-none motion-reduce:!animation-none">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="font-secondary text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-white/45">
              {item}
            </span>
            <span aria-hidden className="h-px w-8 bg-gold/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
