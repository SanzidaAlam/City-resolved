import React from 'react';

const CardSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 h-[450px] animate-pulse">
      <div className="h-48 bg-base-300 w-full rounded-t-2xl"></div>
      <div className="card-body p-5 space-y-4">
        <div className="h-6 bg-base-300 rounded w-3/4"></div>
        <div className="flex gap-2">
           <div className="h-4 bg-base-300 rounded w-1/4"></div>
           <div className="h-4 bg-base-300 rounded w-1/4"></div>
        </div>
        <div className="h-16 bg-base-300 rounded w-full"></div>
        <div className="flex justify-between pt-4">
           <div className="h-8 bg-base-300 rounded w-16"></div>
           <div className="h-8 bg-base-300 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;