import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, esdueno, esSecretaria } = useAuth();

  const menu = [
    { label: "Dashboard", icon: "⊞", path: "/dashboard", visible: true },
    { label: "Casos", icon: "⚖", path: "/casos", visible: true },
    { label: "Clientes", icon: "👤", path: "/clientes", visible: esdueno || esSecretaria },
    { label: "Agenda", icon: "📅", path: "/agenda", visible: true },
    { label: "Expedientes", icon: "🗂", path: "/expedientes", visible: true },
    { label: "Abogados", icon: "👔", path: "/abogados", visible: esdueno },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-center">
        <img
          src={logo}
           alt="Grupo Legal F. Contreras"
          className="h-16 object-contain"
        />
      </div>

      {/* Usuario */}
      <div
        className="px-6 py-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800/50 transition"
        onClick={() => navigate("/perfil")}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-700/40 border border-yellow-700/60 flex items-center justify-center text-yellow-400 text-sm font-bold">
            {usuario?.nombre?.charAt(0) || "U"}
          </div>
          <div>
            <p className="text-white text-sm font-medium leading-tight">{usuario?.nombre}</p>
            <p className="text-gray-500 text-xs">
              {usuario?.rol === "DUENO" ? "Dueño" : usuario?.rol === "SECRETARIA" ? "Secretaria" : "Abogado"}
            </p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menu.filter(item => item.visible).map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                active
                  ? "bg-yellow-700/20 text-yellow-400 border border-yellow-700/30"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-red-900/20 hover:text-red-400 transition"
        >
          <span>⎋</span>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}