import { Header } from "@/components/sections/Header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <TooltipProvider>
        <Header />
        {children}
      </TooltipProvider>
    </>
  );
};

export default Layout;
