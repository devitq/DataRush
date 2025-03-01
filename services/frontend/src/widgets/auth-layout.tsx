import { useUserStore } from "@/shared/stores/user";
import React from "react";
import { Outlet } from "react-router";

export const AuthLayout = () => {
  const fetchUser = useUserStore((state) => state.fetchUser);

  React.useEffect(() => {
    async function fetchData() {
      await fetchUser();
    }

    fetchData();
  }, []);

  return <Outlet />;
};
