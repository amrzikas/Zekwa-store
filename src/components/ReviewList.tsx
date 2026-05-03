import React, { useEffect, useState } from 'react';
import { Star, Clock, User as UserIcon, MessageCircle } from 'lucide-react';
import { Review } from '../types';
import { reviewService } from '../services/reviewService';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ReviewListProps {
  productId: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = reviewService.getReviews(productId, (fetchedReviews) => {
      setReviews(fetchedReviews);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-slate-50 rounded-[28px]" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 border border-slate-100 rounded-[32px] border-dashed">
        <MessageCircle className="h-12 w-12 text-slate-200 mb-4" />
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">No reviews yet</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest max-w-xs">Be the first to share your experience with this product!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
         <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Customer Reviews ({reviews.length})</h3>
         <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sort by:</span>
            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Newest First</span>
         </div>
      </div>

      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm group hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400">
                   {review.userName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{review.userName}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-3 w-3",
                            star <= review.rating ? "fill-primary text-primary" : "text-slate-200"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       {review.createdAt ? formatDistanceToNow(review.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                 <Clock className="h-3 w-3" /> Verified Purchase
              </div>
            </div>

            <p className="text-slate-500 text-sm leading-relaxed pl-1">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
