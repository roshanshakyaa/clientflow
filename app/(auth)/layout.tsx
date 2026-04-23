import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full min-h-svh bg-accent flex items-center justify-center p-4 md:p-8">
      <div className="flex flex-col lg:flex-row gap-2 bg-white min-h-[600px] rounded-lg overflow-hidden w-full max-w-6xl shadow-xl">
        <div className="hidden lg:block lg:flex-1 bg-amber-300 "></div>

        {/* The form container */}
        <div className="flex-1 flex flex-col justify-center">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
