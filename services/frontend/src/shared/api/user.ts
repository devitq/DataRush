import { userFetch } from ".";
import { User } from "../types/user";

export const getCurrentUser = async () => {
  return await userFetch<User>("/me");
};
