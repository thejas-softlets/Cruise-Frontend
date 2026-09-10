import { cn } from "@/lib/utils";

/**
 * Editorial section heading: an optional handwritten script accent word sits
 * above a large Caacupé One title. Used sparingly — one accent per page.
 */
export function SectionHeading({
  title,
  line,
  script,
  className,
  align = "left",
  as: Tag = "h1",
  tone = "dark",
}: {
  title: string;
  line?: string;
  script?: string;
  className?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  tone?: "dark" | "light";
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {script ? (
        <span
          aria-hidden
          className={cn(
            "font-script block text-2xl leading-none",
            tone === "dark" ? "text-gold-bright" : "text-gold",
          )}
        >
          {script}
        </span>
      ) : null}
      <Tag
        className={cn(
          "font-display text-balance",
          script && "mt-1.5",
          Tag === "h1"
            ? "text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl"
            : "text-4xl font-medium leading-[1.08] sm:text-5xl",
          tone === "light" ? "text-[#F6F5F1]" : "text-ink",
        )}
      >
        {title}
      </Tag>
      {line ? (
        <p
          className={cn(
            "mt-4 max-w-xl text-[0.9375rem] leading-relaxed",
            align === "center" && "mx-auto",
            tone === "light" ? "text-white/70" : "text-text-muted",
          )}
        >
          {line}
        </p>
      ) : null}
    </div>
  );
}
