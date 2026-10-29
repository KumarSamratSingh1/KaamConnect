import React from 'react';
import { Star } from 'lucide-react';
export default function StarRating({ rating = 0, count, size = 16, interactive = false, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(star => (
        <button key={star} type="button" disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}>
          <Star size={size}
            className={star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700'} />
        </button>
      ))}
      {count !== undefined && <span className="text-xs text-gray-500 ml-1">({count})</span>}
    </div>
  );
}
