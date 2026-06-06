import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100">
      <div className="flex flex-col items-center">
        <h1 className="flex items-center text-6xl font-black tracking-tighter md:text-9xl text-primary">
          L
          <span className="loading loading-spinner text-secondary mx-2 h-16 w-16 md:h-24 md:w-24"></span>
          ADING
          <span className="text-secondary">.</span>
        </h1>
        <p className="mt-4 text-lg font-medium tracking-widest uppercase text-base-content/60 animate-pulse">
          Please Wait
        </p>
      </div>
    </div>
  );
};

export default Loader;