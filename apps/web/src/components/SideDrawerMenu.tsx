import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: "🏠" },
  { label: "Properties", to: "/properties", icon: "🏢" },
  { label: "Leads", to: "/leads", icon: "👤" },
];

interface SideDrawerMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function SideDrawerMenu({ open, onClose }: SideDrawerMenuProps) {
  const { logout } = useAuth();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-20 bg-black/40 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navigation drawer"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <span className="text-lg font-semibold text-gray-800">C21 Admin</span>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 text-gray-500"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4">
          {NAV_ITEMS.map(({ label, to, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded hover:bg-red-50 transition-colors"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
