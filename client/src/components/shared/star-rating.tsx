import { StarIcon } from "lucide-react";
import { cn } from "cn";

export function StarRating({
  value,
  onChange,
  readOnly = false,
}: {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={cn("text-muted-foreground", !readOnly && "cursor-pointer hover:text-primary")}>
          <StarIcon
            className={cn("size-4", star <= value && "fill-primary text-primary")}
          />
        </button>
      ))}
    </div>
  );
}
