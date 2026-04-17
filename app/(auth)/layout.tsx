import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-svh bg-accent flex items-center justify-center">
      <div className="p-3 rounded-lg flex gap-2 bg-white w-6xl">
        <div className="rounded-md bg-amber-300 flex-1"></div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
