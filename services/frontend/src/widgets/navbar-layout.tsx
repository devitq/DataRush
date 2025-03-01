import { Header } from "@/components/layout/header";
import { Outlet } from "react-router";

const NavbarLayout = () => {
  return (
    <>
      <Header />
      <div className="px-4 sm:px-6">
        <div className="m-auto mt-6 w-full max-w-5xl">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export { NavbarLayout };
