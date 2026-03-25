import type { ComponentPropsWithoutRef } from "react";

type ButtonProps = {
  label: string;
  loading?: boolean;
} & ComponentPropsWithoutRef<"button">;

export default function Button({
  label,
  loading = false,
  disabled,
  className = "",
  type = "submit",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#f97316] hover:bg-[#ea6c0a] active:bg-[#c2410c] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 focus:ring-offset-2 ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin w-4 h-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {loading ? "Cargando..." : label}
    </button>
  );
}
