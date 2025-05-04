import { Button } from "@/components/ui/button";
import { Input } from "../components/input";
import { login } from "@/shared/api/auth";
import { saveToken } from "@/shared/token";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/shared/api";

export const LoginTab = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loginAction = async (
    formData: FormData,
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setLoading(true);

    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setError("Неверное имя пользователя или пароль");
      setLoading(false);
      return;
    }

    try {
      const token = await login({
        email: email.toString(),
        password: password.toString(),
      });
      saveToken(token.token);
      navigate("/");
    } catch (e) {
      if (e instanceof ApiError && (e.status === 400 || e.status === 401)) {
        setError("Неверное имя пользователя или пароль");
      } else {
        setError("Произошла непредвиденная ошибка");
      }
    }

    setLoading(false);
  };

  return (
    <form
      className="flex w-full flex-col items-stretch gap-8"
      onSubmit={(e) => loginAction(new FormData(e.currentTarget), e)}
    >
      <div className="flex flex-col items-stretch gap-5">
        <Input
          id="email"
          name="email"
          label="Почта"
          placeholder="vdeniske@megazord.pobeda"
        />
        <Input
          id="password"
          name="password"
          label="Пароль"
          placeholder="Введите пароль"
          type="password"
          className="placeholder:font-hse-sans font-mono"
        />
      </div>
      {error && <span className="text-red-500">{error}</span>}
      <Button type="submit">{loading ? <Spinner size={16} /> : "Войти"}</Button>
    </form>
  );
};
