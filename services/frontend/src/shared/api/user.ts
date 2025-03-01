import { apiFetch } from ".";
import { User } from "../types/user";

export const getCurrentUser = async () => {
  return await apiFetch<User>("/me");
};
