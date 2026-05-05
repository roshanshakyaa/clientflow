import { Header } from "@/components/sections/Header";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
