import React from "react";

const GlobalGlow = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-50">
      
      {/* Top Left Glow - Primary Color */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[100px] md:blur-[150px]" />
      
      {/* Bottom Right Glow - Secondary Color */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-secondary/5 rounded-full blur-[100px] md:blur-[150px]" />
      
      {/* Optional: Center/Random Accent Glow */}
      <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] bg-accent/5 rounded-full blur-[120px] md:blur-[180px] opacity-60" />

    </div>
  );
};

export default GlobalGlow;