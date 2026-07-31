import { useState } from "react";
import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Overlay móvil */}
      {sidebarAbierto && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarAbierto(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-30 transform transition-transform duration-300 ${sidebarAbierto ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <Sidebar onClose={() => setSidebarAbierto(false)} />
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header móvil */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
          <button
            onClick={() => setSidebarAbierto(true)}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ☰
          </button>
          <img src="/src/assets/logo.png" alt="Logo" className="h-8 object-contain" />
          <div className="w-8" />
        </div>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}