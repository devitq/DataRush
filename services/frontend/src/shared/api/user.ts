import { userFetch } from ".";
import { User, UserStats } from "../types/user";

export const getCurrentUser = async () => {
  return await userFetch<User>("/me");
};

export const getCurrentUserStats = async () => {
  return await userFetch<UserStats>("/me/stat");
};
