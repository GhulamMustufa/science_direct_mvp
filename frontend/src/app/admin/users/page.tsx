"use client";

import { useState } from "react";
import { useAdmin } from "@/features/admin/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { User, UserRole } from "@/types";
import { TableSkeleton } from "@/components/ui/Loading";

function EditUserModal({ 
  user, 
  onSave, 
  onBlock, 
  onClose 
}: { 
  user: User; 
  onSave: (data: { firstName: string; lastName: string; role: string }) => Promise<void>; 
  onBlock: () => Promise<void>;
  onClose: () => void;
}) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ firstName, lastName, role: selectedRole });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleBlock = async () => {
    if (!confirm(`Are you sure you want to block ${user.email}? This cannot be undone.`)) return;
    setSaving(true);
    try {
      await onBlock();
      onClose();
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Edit User</h3>
        <p className="text-xs text-zinc-500">Update information for <strong className="text-zinc-700 dark:text-zinc-300">{user.email}</strong></p>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1 block">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full h-10 border border-zinc-200 rounded-lg bg-white dark:bg-zinc-850 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1 block">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full h-10 border border-zinc-200 rounded-lg bg-white dark:bg-zinc-850 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1 block">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full h-10 border border-zinc-200 rounded-lg bg-white dark:bg-zinc-850 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800"
            >
              {["reader", "author", "editor", "admin"].map((r) => (
                <option key={r} value={r} className="capitalize">{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between pt-2">
          <Button variant="destructive" size="sm" onClick={handleBlock} disabled={saving} className="bg-red-600 hover:bg-red-700 text-white">
            Block Account
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserRow({ user, onEdit }: { user: User; onEdit: () => void }) {
  const dateStr = new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return (
    <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 text-sm">
      <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
        {user.firstName || "-"} {user.lastName || ""}
      </td>
      <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{user.email}</td>
      <td className="px-6 py-4 font-medium capitalize text-zinc-700 dark:text-zinc-300">{user.role}</td>
      <td className="px-6 py-4 text-zinc-400">{dateStr}</td>
      <td className="px-6 py-4 text-right">
        <Button variant="ghost" size="sm" onClick={onEdit} className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30">
          Edit
        </Button>
      </td>
    </tr>
  );
}

export default function UsersAdminPage() {
  const { users, totalUsers, loadingUsers, usersPage, setUsersPage, updateUser, blockUser } = useAdmin();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const totalPages = Math.ceil(totalUsers / 10) || 1;

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">User Management</h1>
        <p className="mt-2 text-sm text-zinc-500">Configure roles and authorization profiles for the system.</p>
      </div>

      {loadingUsers ? (
        <TableSkeleton rows={5} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-150 bg-zinc-50/70 text-xs font-semibold text-zinc-500 uppercase tracking-wider dark:border-zinc-800 dark:bg-zinc-900/30">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Registered</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {users.map((u) => (
                  <UserRow key={u.id} user={u} onEdit={() => setEditingUser(u)} />
                ))}
              </tbody>
            </table>
          </div>

          {totalUsers > 10 && (
            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" size="sm" disabled={usersPage <= 1} onClick={() => setUsersPage(usersPage - 1)}>Previous</Button>
              <span className="text-sm text-zinc-500">Page {usersPage} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={usersPage >= totalPages} onClick={() => setUsersPage(usersPage + 1)}>Next</Button>
            </div>
          )}
        </>
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onSave={async (data) => updateUser(editingUser.id, data)}
          onBlock={async () => blockUser(editingUser.id)}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}

