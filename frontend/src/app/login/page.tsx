import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sign In
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Or{" "}
            <a
              href={process.env.NEXT_PUBLIC_OJS_BASE_URL ? `${process.env.NEXT_PUBLIC_OJS_BASE_URL}/index.php/index/user/register` : "#"}
              className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              create a new account on OJS
            </a>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
