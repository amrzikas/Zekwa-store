import React, { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { reviewService } from '../services/reviewService';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';

interface ReviewFormProps {
  productId: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
  const { user } = useStore();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-6 text-center">
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
          Please <span className="text-primary">Sign In</span> to leave a review
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.addReview(productId, user.uid, user.displayName, rating, comment);
      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
    } catch (error) {
      toast.error('Failed to submit review. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 mb-2">
           <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
             <Star className="h-4 w-4 text-primary fill-primary" />
           </div>
           <h3 className="text-md font-black text-slate-900 uppercase tracking-tight">Write a Review</h3>
        </div>

        {/* Star Rating */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Your Rating</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-125 focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  className={cn(
                    "h-8 w-8 transition-colors",
                    (hover || rating) >= star ? "fill-primary text-primary" : "text-slate-200"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Your Comment</label>
          <div className="relative">
            <MessageSquare className="absolute top-4 left-4 h-5 w-5 text-slate-300" />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              className="w-full min-h-[120px] pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
              maxLength={1000}
            />
          </div>
          <div className="flex justify-end">
             <span className="text-[10px] font-bold text-slate-400">{comment.length}/1000</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-4 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className={cn("h-4 w-4 transition-transform", !isSubmitting && "group-hover:translate-x-1 group-hover:-translate-y-1")} />
          {isSubmitting ? 'Submitting...' : 'Post Review'}
        </button>
      </div>
    </form>
  );
};
