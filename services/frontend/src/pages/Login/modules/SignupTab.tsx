import { Button } from "@/components/ui/button";
import { Input } from "../components/input";
import { z } from "zod";
import React from "react";
import { signup } from "@/shared/api/auth";
import { Spinner } from "@/components/ui/spinner";
import { saveToken } from "@/shared/token";
import { useNavigate } from "react-router";
import { ApiError } from "@/shared/api";

const signupSchema = z.object({
  email: z.string().email({ message: "Некорректная почта" }).trim(),
  username: z
    .string()
    .min(1, { message: "Имя пользователя должно быть не меньше 1 знака" })
    .max(50, { message: "Имя пользователя должно быть не больше 50 знаков" })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Пароль должен быть не меньше 8 знаков" })
    .regex(/[a-zA-Z]/, {
      message: "Пароль должен содержать хотя бы одну букву",
    })
    .regex(/[0-9]/, { message: "Пароль должен содержать хотя бы одну цифру" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Пароль должен содержать хотя бы один специальный символ",
    })
    .trim(),
});

interface SignupFormErrors {
  username?: string[];
  email?: string[];
  password?: string[];

  message?: string;
}

export const SignupTab = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = React.useState<SignupFormErrors | null>(null);
  const [loading, setLoading] = React.useState(false);

  const signupAction = async (
    formData: FormData,
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setLoading(true);

    const validatedFields = signupSchema.safeParse({
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      setErrors(validatedFields.error.flatten().fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const token = await signup({
        ...validatedFields.data,
      });
      saveToken(token.token);
      navigate("/");
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.status === 400) {
          setErrors({ message: "Неверные данные" });
        } else if (e.status === 409) {
          setErrors({
            message:
              "Пользователь с такой почтой или именем пользователя уже существует",
          });
        } else {
          setErrors({ message: "Произошла непредвиденная ошибка" });
        }
      } else {
        setErrors({ message: "Произошла непредвиденная ошибка" });
      }
    }

    setLoading(false);
  };

  return (
    <form
      className="flex w-full flex-col items-stretch gap-8"
      onSubmit={(e) => signupAction(new FormData(e.currentTarget), e)}
    >
      <div className="flex flex-col items-stretch gap-5">
        <Input
          id="email"
          name="email"
          label="Почта"
          placeholder="vdeniske@megazord.pobeda"
          error={errors?.email?.at(0)}
          onChange={() => setErrors(null)}
        />

        <Input
          id="username"
          name="username"
          label="Имя пользователя"
          placeholder="Введите имя пользователя"
          error={errors?.username?.at(0)}
          onChange={() => setErrors(null)}
        />

        <Input
          id="password"
          name="password"
          label="Пароль"
          placeholder="Введите пароль"
          type="password"
          error={errors?.password?.at(0)}
          onChange={() => setErrors(null)}
        />
      </div>

      {errors?.message && (
        <span className="text-red-500">{errors.message}</span>
      )}

      <Button type="submit" onClick={() => setErrors(null)}>
        {loading ? <Spinner size={16} /> : "Зарегистрироваться"}
      </Button>
    </form>
  );
};
