import { apiFetch } from "@/lib/api";
import { User } from "@/types";

export const authService = {
  async getMe(): Promise<User> {
    return apiFetch<User>("/auth/me");
  },

  async login(data: Record<string, unknown>): Promise<{ user: User }> {
    return apiFetch<{ user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async register(data: Record<string, unknown>): Promise<{ user: User }> {
    return apiFetch<{ user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async logout(): Promise<void> {
    await apiFetch<void>("/auth/logout", {
      method: "POST",
    });
  },
};
