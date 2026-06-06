const HowItWorksSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="card bg-base-200 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="skeleton w-14 h-14 rounded-full mb-4"></div>
            <div className="skeleton h-4 w-32 mb-2"></div>
            <div className="skeleton h-3 w-40"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HowItWorksSkeleton;
