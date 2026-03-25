import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideDrawerMenu from "./SideDrawerMenu";

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center h-14 bg-white border-b border-gray-200 px-4 shadow-sm">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded hover:bg-gray-100 text-gray-600"
          aria-label="Open menu"
        >
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
        <span className="ml-3 text-sm font-semibold text-gray-700">C21 Admin</span>
      </header>

      <SideDrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Page content */}
      <main className="pt-14">
        <Outlet />
      </main>
    </div>
  );
}
