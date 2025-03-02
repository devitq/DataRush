import { apiFetch } from ".";

interface AuthResponse {
  token: string;
}

export const signup = async (body: {
  email: string;
  username: string;
  password: string;
}) => {
  return await apiFetch<AuthResponse>("/sign-up", {
    method: "POST",
    body,
  });
};

export const login = async (body: { email: string; password: string }) => {
  return await apiFetch<AuthResponse>("/sign-in", {
    method: "POST",
    body,
  });
};
