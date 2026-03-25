import React, { type ComponentPropsWithoutRef } from "react";
type InputProps = {
  label: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & ComponentPropsWithoutRef<"input">;

export default function Input({
  label,
  value,
  type,
  onChange,
  ...otherProps
}: InputProps) {
  return (
    <div className="flex flex-col space-y-2 w-full">
      <label className="text-gray-700 font-semibold text-left">{label}</label>
      <input
        type={type || "text"}
        className="p-2 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={onChange}
        required
        {...otherProps}
      />
    </div>
  );
}
