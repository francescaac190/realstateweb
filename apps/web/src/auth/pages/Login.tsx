import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function EyeOpenIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message ?? "Credenciales incorrectas");
      } else {
        setError("Error de conexión. Intenta nuevamente.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-white">
      {/* ── Left brand panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 bg-gradient-to-br from-[#6b10e8] via-[#aa3bff] to-[#c084fc] text-white select-none">
        <span className="text-xl font-bold tracking-tight">C21 Admin</span>

        <div className="space-y-5">
          <div className="w-12 h-1 rounded-full bg-white/40" />
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            Gestiona tus propiedades en un solo lugar.
          </h1>
          <p className="text-purple-100 text-base leading-relaxed max-w-sm">
            Accede a tu panel para administrar propiedades, leads y agentes de
            forma eficiente.
          </p>
        </div>

        <p className="text-purple-300 text-sm">
          Century 21 · Panel de administración
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <span className="text-2xl font-bold text-[#aa3bff]">C21 Admin</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Iniciar sesión
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Ingresa tus credenciales para continuar.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 bg-white transition-[border-color,box-shadow] focus:outline-none focus:ring-2 focus:ring-[#aa3bff]/30 focus:border-[#aa3bff]"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 bg-white transition-[border-color,box-shadow] focus:outline-none focus:ring-2 focus:ring-[#aa3bff]/30 focus:border-[#aa3bff]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#aa3bff] hover:bg-[#9428e8] active:bg-[#7c10e0] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#aa3bff]/50 focus:ring-offset-2"
            >
              {isLoading && (
                <svg
                  className="animate-spin w-4 h-4"
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
              {isLoading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
