import { apiFetch } from "@/lib/api";
import { User } from "@/types";

export const authService = {
  async getMe(): Promise<User> {
    return apiFetch<User>("/auth/me");
  },

  async logout(): Promise<void> {
    await apiFetch<void>("/auth/logout", {
      method: "POST",
    });
  },
};
