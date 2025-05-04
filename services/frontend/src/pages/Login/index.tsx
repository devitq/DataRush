import { DataRush } from "@/components/ui/icons/datarush";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginTab } from "./modules/LoginTab";
import { SignupTab } from "./modules/SignupTab";
import React from "react";
import { getToken } from "@/shared/token";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = getToken();
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center gap-10 px-4 py-10 sm:gap-18 sm:py-18">
      <DataRush size={50} className="min-h-[52px]" />
      <div className="flex w-full max-w-96 flex-col items-center gap-7">
        <h1 className="text-center text-4xl font-semibold">
          Добро пожаловать!
        </h1>
        <Tabs
          defaultValue="login"
          className="flex w-full flex-col items-center gap-7"
        >
          <TabsList>
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="signup">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login" asChild>
            <LoginTab />
          </TabsContent>

          <TabsContent value="signup" asChild>
            <SignupTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LoginPage;
