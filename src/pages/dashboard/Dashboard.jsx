import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import API from "../../config";

const getToken = () => localStorage.getItem("token");

const ESTADOS = {
  NUEVO: { label: "Nuevo", color: "bg-blue-900/30 text-blue-400 border-blue-800/50" },
  EN_PROCESO: { label: "En Proceso", color: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50" },
  PENDIENTE: { label: "Pendiente", color: "bg-yellow-900/30 text-yellow-400 border-yellow-800/50" },
  CERRADO: { label: "Cerrado", color: "bg-gray-800 text-gray-500 border-gray-700" },
};

export default function Dashboard() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    const res = await fetch(`${API}/stats`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const formatFecha = (fecha) => new Date(fecha).toLocaleDateString("es-DO", {
    day: "numeric", month: "short",
  });

  const formatHora = (fecha) => new Date(fecha).toLocaleTimeString("es-DO", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">
          Bienvenido, {usuario.nombre}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString("es-DO", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Casos Activos", value: stats?.casosActivos ?? "—", icon: "⚖", sub: `${stats?.totalCasos ?? 0} total` },
          { label: "Citas Hoy", value: stats?.citasHoy ?? "—", icon: "📅", sub: "pendientes" },
          { label: "Clientes", value: stats?.totalClientes ?? "—", icon: "👤", sub: "registrados" },
          { label: "Documentos", value: stats?.totalDocumentos ?? "—", icon: "🗂", sub: "en expedientes" },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-sm">{stat.label}</span>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {loading ? <span className="text-gray-600 text-xl">...</span> : stat.value}
            </p>
            <p className="text-gray-600 text-xs mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Casos recientes */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <span>⚖</span> Casos Recientes
            </h3>
            <a href="/casos" className="text-emerald-500 text-xs hover:text-emerald-400 transition">
              Ver todos
            </a>
          </div>
          {loading ? (
            <div className="text-center py-10 text-gray-600 text-sm">Cargando...</div>
          ) : stats?.casosRecientes?.length === 0 ? (
            <div className="text-center py-10 text-gray-600 text-sm">No hay casos registrados</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {stats?.casosRecientes?.map((c) => (
                <div key={c.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{c.titulo}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{c.cliente?.nombre}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${ESTADOS[c.estado]?.color}`}>
                    {ESTADOS[c.estado]?.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Próximas citas */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <span>📅</span> Próximas Citas
            </h3>
            <a href="/agenda" className="text-emerald-500 text-xs hover:text-emerald-400 transition">
              Ver agenda
            </a>
          </div>
          {loading ? (
            <div className="text-center py-10 text-gray-600 text-sm">Cargando...</div>
          ) : stats?.citasProximas?.length === 0 ? (
            <div className="text-center py-10 text-gray-600 text-sm">No hay citas próximas</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {stats?.citasProximas?.map((c) => (
                <div key={c.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{c.caso?.titulo}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{c.caso?.cliente?.nombre} · {c.abogado?.nombre}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 text-sm font-medium">{formatHora(c.fecha)}</p>
                    <p className="text-gray-600 text-xs">{formatFecha(c.fecha)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}