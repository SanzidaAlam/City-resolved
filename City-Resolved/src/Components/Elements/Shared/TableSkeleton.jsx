import React from "react";

const TableSkeleton = () => {
  return (
    <div className="bg-base-100/90 rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden p-6 md:p-8 relative">
       <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 pointer-events-none"></div>

      <div className="flex items-center gap-4 border-b border-base-content/10 pb-6 mb-6 opacity-50 hidden md:flex">
         <div className="skeleton h-4 w-16 bg-base-content/20"></div>
         <div className="flex-1 skeleton h-4 w-1/3 bg-base-content/20"></div>
         <div className="skeleton h-4 w-24 bg-base-content/20"></div>
         <div className="skeleton h-4 w-10 bg-base-content/20"></div>
      </div>

      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col sm:flex-row items-center gap-6 border-b border-base-content/5 last:border-0 pb-6 last:pb-0">
            <div className="skeleton w-16 h-16 rounded-2xl shrink-0 bg-base-300/50"></div>
            
            <div className="flex-1 space-y-3 w-full text-center sm:text-left">
              <div className="skeleton h-5 w-3/4 sm:w-1/3 bg-base-300/50 rounded-md mx-auto sm:mx-0"></div>
              <div className="skeleton h-3 w-1/2 sm:w-1/4 bg-base-300/50 rounded-md mx-auto sm:mx-0"></div>
            </div>
            
            <div className="flex items-center gap-3">
                 <div className="skeleton h-9 w-24 rounded-full bg-base-300/50"></div>
                 <div className="skeleton h-10 w-10 rounded-full shrink-0 bg-base-300/50"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;