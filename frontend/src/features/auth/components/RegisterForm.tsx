"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { FormField } from "./FormField";
import { Button } from "@/components/ui/button";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  firstName: z.string().max(100, "First name must be under 100 characters").optional(),
  lastName: z.string().max(100, "Last name must be under 100 characters").optional(),
  role: z.enum(["reader", "author"]).optional(),
});

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("reader");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const result = registerSchema.safeParse({ email, password, firstName, lastName, role });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      await register({ email, password, firstName, lastName, role });
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      setServerError((err as Error).message || "Email is already registered. Please login.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {serverError && (
        <div className="rounded-lg bg-red-50 p-4 text-xs font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-900">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="firstName"
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={errors.firstName}
          disabled={submitting}
        />
        <FormField
          id="lastName"
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={errors.lastName}
          disabled={submitting}
        />
      </div>

      <FormField
        id="email"
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        disabled={submitting}
        required
      />

      <FormField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        disabled={submitting}
        required
      />

      <div className="space-y-1.5 w-full">
        <label
          htmlFor="role"
          className="text-xs font-bold text-zinc-500 uppercase tracking-wider dark:text-zinc-400"
        >
          Account Role
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={submitting}
          className="h-11 w-full rounded-lg border px-4 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          <option value="reader">Reader</option>
          <option value="author">Author</option>
        </select>
        {errors.role && (
          <span className="text-xs font-semibold text-red-500 block">
            {errors.role}
          </span>
        )}
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-sm font-semibold transition-all"
      >
        {submitting ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
