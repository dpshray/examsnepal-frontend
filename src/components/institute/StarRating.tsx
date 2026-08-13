"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  size?: number;
}

export default function StarRating({ value, size = 20 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={cn(star <= value ? "fill-yellow-400 text-yellow-400" : "fill-none text-muted-foreground")}
        />
      ))}
    </div>
  );
}
