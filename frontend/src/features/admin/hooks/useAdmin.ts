"use client";

import { useEffect, useState, useCallback } from "react";
import { User } from "@/types";
import { adminService } from "../services/admin.service";

export function useAdmin(limit = 10) {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);
  const [usersPage, setUsersPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const res = await adminService.getUsers(usersPage, limit);
      setUsers(res.users);
      setTotalUsers(res.total);
    } catch (err: unknown) {
      setErrorUsers((err as Error).message || "Failed to load users list.");
    } finally {
      setLoadingUsers(false);
    }
  }, [usersPage, limit]);

  const changeUserRole = async (userId: string, role: string) => {
    try {
      const updatedUser = await adminService.changeUserRole(userId, role);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: updatedUser.role } : u))
      );
    } catch (err: unknown) {
      throw new Error((err as Error).message || "Failed to change user role.");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    totalUsers,
    loadingUsers,
    errorUsers,
    usersPage,
    setUsersPage,
    changeUserRole,
    refreshUsers: fetchUsers,
  };
}
