type ButtonProps = {
  label: string;
  onClick?: () => void;
  loading?: boolean;
  className?: string;
};
export default function Button({
  label,
  onClick,
  loading,
  className,
}: ButtonProps) {
  return (
    <div>
      <button
        type="submit"
        disabled={loading}
        onClick={onClick}
        className={`bg-orange-300 text-white font-bold py-2 px-4 rounded-md hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      >
        {loading ? "Cargando..." : label}
      </button>
    </div>
  );
}
