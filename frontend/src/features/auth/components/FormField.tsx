import { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export function FormField({ id, label, error, ...props }: FormFieldProps) {
  return (
    <div className="space-y-1.5 w-full">
      <label
        htmlFor={id}
        className="text-xs font-bold text-zinc-500 uppercase tracking-wider dark:text-zinc-400"
      >
        {label}
      </label>
      <input
        id={id}
        {...props}
        className={`h-11 w-full rounded-lg border px-4 text-sm bg-white dark:bg-zinc-900 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-zinc-200 dark:border-zinc-800"
        }`}
      />
      {error && (
        <span className="text-xs font-semibold text-red-500 block">
          {error}
        </span>
      )}
    </div>
  );
}
