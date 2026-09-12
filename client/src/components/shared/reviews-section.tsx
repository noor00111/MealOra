"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  const mutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
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
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-medium text-foreground">Reviews</h2>
        {reviews && reviews.length > 0 && (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <StarRating value={Math.round(averageRating)} readOnly />
            {averageRating.toFixed(1)} ({reviews.length})
          </span>
        )}
      </div>

      {user?.role === "CUSTOMER" && !alreadyReviewed && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm font-medium text-foreground">Leave a review</p>
            <StarRating value={rating} onChange={setRating} />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts (optional)"
              className="min-h-20 rounded-lg border border-input bg-card p-2.5 text-sm outline-none focus-visible:border-ring"
            />
            {mutation.isError && (
              <p className="text-sm text-destructive">{getErrorMessage(mutation.error)}</p>
            )}
            <Button
              size="sm"
              className="w-fit"
              disabled={rating === 0 || mutation.isPending}
              onClick={() => mutation.mutate({ mealId, rating, comment: comment || undefined })}>
              {mutation.isPending ? "Submitting..." : "Submit review"}
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Loading reviews...</p>}
      {!isLoading && reviews?.length === 0 && (
        <p className="text-sm text-muted-foreground">No reviews yet.</p>
      )}

      <motion.div initial="hidden" animate="show" variants={staggerContainer} className="flex flex-col gap-3">
        {reviews?.map((review) => (
          <motion.div key={review.id} variants={fadeUp}>
            <Card>
              <CardContent className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{review.customer.name}</span>
                  <StarRating value={review.rating} readOnly />
                </div>
                {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
