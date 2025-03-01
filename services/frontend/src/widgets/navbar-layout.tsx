import { Header } from "@/components/layout/header";
import { Outlet } from "react-router";

const NavbarLayout = () => {
  return (
    <>
      <Header />
      <div className="m-auto mt-6 w-full max-w-5xl">
        <Outlet />
      </div>
    </>
  );
};

export { NavbarLayout };
