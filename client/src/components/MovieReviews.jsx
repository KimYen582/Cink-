import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { submitReview } from '../services/movieService';

const MovieReviews = ({ movieId, reviews = [], onReviewAdded }) => {
  const { isSignedIn } = useUser();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error('You need to be logged in to write a review.');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please enter a comment.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview(movieId, { rating, comment });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      if (onReviewAdded) onReviewAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review. You may have already reviewed this movie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-20">
      <h2 className="text-2xl font-semibold mb-6">User Reviews</h2>
      
      {/* Review Form */}
      {isSignedIn ? (
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-10">
          <h3 className="text-lg font-medium mb-4">Write a Review</h3>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-400 text-sm mr-2">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 cursor-pointer transition-colors ${
                  star <= rating ? 'fill-primary text-primary' : 'text-gray-600'
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you think about the movie?"
            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary resize-none h-24 mb-4"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-full font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      ) : (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-10 text-center">
          <p className="text-gray-400">Please log in to write a review.</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="bg-white/5 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold">{review.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="text-sm font-medium">{review.rating}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{review.comment}</p>
              <p className="text-gray-600 text-xs mt-3">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MovieReviews;
