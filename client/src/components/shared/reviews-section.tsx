"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { createReview, fetchMealReviews } from "@/lib/review-api";
import { StarRating } from "@/components/shared/star-rating";

export function ReviewsSection({ mealId }: { mealId: string }) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", mealId],
    queryFn: () => fetchMealReviews(mealId),
  });

  const mutation = useMutation({mutationFn: createReview, onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", mealId] });
      setRating(0);
      setComment("");
    },
  });

  const alreadyReviewed = reviews?.some((r) => r.customerId === user?.id);
  const averageRating = reviews?.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="flex flex-col gap-4">

      <div className="flex items-center justify-between">
        <h2
          className="text-base font-bold text-foreground"
          style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
          Reviews
        </h2>

        {reviews && reviews.length > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating value={Math.round(averageRating)} readOnly />
            <span className="text-xs font-semibold text-muted-foreground tabular-nums">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              ({reviews.length})
            </span>
          </div>
        )}
      </div>

      {user?.role === "CUSTOMER" && !alreadyReviewed && (
        <div
          className="rounded-2xl p-4 border border-border bg-card"
          style={{ boxShadow: "0 2px 8px 0 rgba(74,140,63,0.05)" }}>
          <p className="text-sm font-semibold text-foreground mb-3">Leave a review</p>
          <StarRating value={rating} onChange={setRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts (optional)"
            className="mt-3 w-full min-h-[80px] rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors resize-none"
          />
          {mutation.isError && (
            <p className="text-xs text-destructive mt-2">{getErrorMessage(mutation.error)}</p>
          )}
          <button
            disabled={rating === 0 || mutation.isPending}
            onClick={() =>
              mutation.mutate({ mealId, rating, comment: comment || undefined })
            }
            className="mt-3 px-5 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: "var(--primary)" }}>
            {mutation.isPending ? "Submitting…" : "Submit review"}
          </button>
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && reviews?.length === 0 && (
        <p className="text-xs text-muted-foreground py-2">
          No reviews yet — be the first to share your experience.
        </p>
      )}

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="flex flex-col gap-3">

        {reviews?.map((review) => (
          <motion.div key={review.id} variants={fadeUp}>
            <div
              className="rounded-2xl px-4 py-3.5 border border-border bg-card"
              style={{ boxShadow: "0 1px 6px 0 rgba(74,140,63,0.04)" }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="size-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ backgroundColor: "rgba(74,140,63,0.1)", color: "var(--primary)" }}>
                    {review.customer.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {review.customer.name}
                  </span>
                </div>
                <StarRating value={review.rating} readOnly />
              </div>
              {review.comment && (
                <p className="text-xs text-muted-foreground leading-relaxed pl-9">
                  {review.comment}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
