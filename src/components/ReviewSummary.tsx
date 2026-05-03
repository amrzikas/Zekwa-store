import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { reviewService } from '../services/reviewService';
import { cn } from '../lib/utils';

interface ReviewSummaryProps {
  productId: string;
  initialRating: number;
  initialCount: number;
  className?: string;
  starSize?: string;
  textSize?: string;
}

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({ 
  productId, 
  initialRating, 
  initialCount,
  className,
  starSize = "h-3 w-3",
  textSize = "text-[10px]"
}) => {
  const [rating, setRating] = useState(initialRating);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const unsubscribe = reviewService.getReviews(productId, (reviews) => {
      if (reviews.length > 0) {
        const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
        setRating(Number(avg.toFixed(1)));
        setCount(reviews.length);
      }
    });

    return () => unsubscribe();
  }, [productId]);

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={cn(starSize, i < Math.floor(rating) ? "fill-primary text-primary" : "text-slate-200")} 
          />
        ))}
      </div>
      <span className={cn("font-bold text-slate-400", textSize)}>({count})</span>
    </div>
  );
};
