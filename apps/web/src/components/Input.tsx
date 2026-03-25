import React, { type ComponentPropsWithoutRef, type ReactNode } from "react";

type InputProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suffix?: ReactNode;
} & ComponentPropsWithoutRef<"input">;

export default function Input({
  label,
  value,
  type = "text",
  onChange,
  suffix,
  id,
  className = "",
  ...otherProps
}: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          required
          className={`w-full px-3.5 py-2.5 ${suffix ? "pr-10" : ""} rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 bg-white transition-[border-color,box-shadow] focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] ${className}`}
          {...otherProps}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}
