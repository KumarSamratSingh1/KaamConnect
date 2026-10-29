import React from 'react';
export default function SkeletonCard({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="skeleton w-14 h-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          </div>
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-2/3 rounded" />
          <div className="flex gap-2">
            {[1,2,3].map(j => <div key={j} className="skeleton h-6 w-16 rounded-full" />)}
          </div>
          <div className="skeleton h-10 w-full rounded-xl" />
        </div>
      ))}
    </>
  );
}
