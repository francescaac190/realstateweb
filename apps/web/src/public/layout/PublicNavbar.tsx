import { NavLink } from 'react-router-dom';

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-1.5 font-bold text-gray-900 text-base">
          C21
          <span className="text-[#f97316]">·</span>
        </NavLink>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-6">
          {[
            { label: 'Propiedades', to: '/properties' },
            { label: 'Agentes', to: '/agents' },
          ].map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-[#f97316]' : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Admin button */}
        <NavLink
          to="/login"
          className="text-xs font-semibold text-gray-500 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
        >
          Admin →
        </NavLink>
      </div>
    </header>
  );
}
