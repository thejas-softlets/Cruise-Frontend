import { RatingStars } from "@/components/ui/RatingStars";
import type { Review } from "@/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-ink/8 bg-white p-7">
      <RatingStars rating={review.rating} />
      <blockquote className="font-body mt-5 flex-1 text-base leading-relaxed text-ink/85">
        “{review.quote}”
      </blockquote>
      <figcaption className="mt-6 text-[0.8125rem] text-text-muted">
        <span className="font-semibold text-ink">{review.guestName}</span>
        {" · "}
        {review.guestLocation}
      </figcaption>
    </figure>
  );
}
