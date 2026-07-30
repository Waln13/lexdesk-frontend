import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import API from "../../config";

const getToken = () => localStorage.getItem("token");

const ESTADOS = {
  NUEVO: { label: "Nuevo", color: "bg-blue-900/30 text-blue-400 border-blue-800/50" },
  EN_PROCESO: { label: "En Proceso", color: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50" },
  PENDIENTE: { label: "Pendiente", color: "bg-yellow-900/30 text-yellow-400 border-yellow-800/50" },
  CERRADO: { label: "Cerrado", color: "bg-gray-800 text-gray-500 border-gray-700" },
};

const tipoIcono = (tipo) => {
  if (tipo?.includes("pdf")) return "📄";
  if (tipo?.includes("image")) return "🖼";
  if (tipo?.includes("word")) return "📝";
  return "📎";
};

export default function DetalleCaso() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caso, setCaso] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    const res = await fetch(`${API}/casos/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    setCaso(data);
    setLoading(false);
  };

  useEffect(() => { cargar(); }, [id]);

  const formatFecha = (fecha) => new Date(fecha).toLocaleDateString("es-DO", {
    day: "numeric", month: "long", year: "numeric",
  });

  const formatHora = (fecha) => new Date(fecha).toLocaleTimeString("es-DO", {
    hour: "2-digit", minute: "2-digit",
  });

  if (loading) return (
    <MainLayout>
      <div className="text-center py-20 text-gray-600">Cargando...</div>
    </MainLayout>
  );

  if (!caso || caso.message) return (
    <MainLayout>
      <div className="text-center py-20 text-gray-600">Caso no encontrado</div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="flex items-start justify-between mb-8">
        <div>
          <button onClick={() => navigate("/casos")} className="text-gray-500 hover:text-white text-sm flex items-center gap-2 mb-3 transition">
            ← Volver a casos
          </button>
          <div className="flex items-center gap-3 mb-1">
            {caso.numeroExpediente && (
              <span className="text-emerald-400 text-sm font-mono bg-emerald-900/20 border border-emerald-800/30 px-3 py-1 rounded-full">
                {caso.numeroExpediente}
              </span>
            )}
            <span className={`text-xs px-2.5 py-1 rounded-full border ${ESTADOS[caso.estado]?.color}`}>
              {ESTADOS[caso.estado]?.label}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-2">{caso.titulo}</h2>
          <p className="text-gray-500 text-sm mt-1">Creado el {formatFecha(caso.creadoEn)}</p>
        </div>
        <button onClick={() => navigate("/casos")} className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-4 py-2.5 rounded-lg transition">
          Volver
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4">⚖ Información del Caso</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs uppercase">Tipo</span>
                <span className="text-white text-sm">{caso.tipo === "CONSULTA" ? "Consulta" : "Representación"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs uppercase">Área</span>
                <span className="text-white text-sm">{caso.area || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs uppercase">Estado</span>
                <span className="text-white text-sm">{ESTADOS[caso.estado]?.label}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4">👤 Cliente</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700/20 border border-emerald-700/30 flex items-center justify-center text-emerald-400 font-bold">
                {caso.cliente?.nombre?.charAt(0)}
              </div>
              <div>
                <p className="text-white font-medium">{caso.cliente?.nombre}</p>
                <p className="text-gray-500 text-xs">{caso.cliente?.telefono || "Sin teléfono"}</p>
                <p className="text-gray-500 text-xs">{caso.cliente?.email || "Sin email"}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4">👔 Abogado Asignado</h3>
            {caso.abogado ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-700/20 border border-yellow-700/30 flex items-center justify-center text-yellow-400 font-bold">
                  {caso.abogado?.nombre?.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium">{caso.abogado?.nombre}</p>
                  <p className="text-gray-500 text-xs">Abogado</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">Sin abogado asignado</p>
            )}
          </div>

          {caso.descripcion && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-white font-semibold text-sm mb-3">📝 Descripción</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{caso.descripcion}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">📅 Citas ({caso.citas?.length || 0})</h3>
              <button onClick={() => navigate("/agenda")} className="text-emerald-500 text-xs hover:text-emerald-400 transition">
                Ver agenda
              </button>
            </div>
            {caso.citas?.length === 0 ? (
              <div className="text-center py-8 text-gray-600 text-sm">No hay citas para este caso</div>
            ) : (
              <div className="divide-y divide-gray-800">
                {caso.citas?.map((c) => (
                  <div key={c.id} className="px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{c.motivo || "Sin motivo"}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{formatFecha(c.fecha)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 text-sm font-medium">{formatHora(c.fecha)}</p>
                      <span className={`text-xs ${c.completada ? "text-gray-500" : "text-blue-400"}`}>
                        {c.completada ? "Completada" : "Pendiente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">🗂 Documentos ({caso.documentos?.length || 0})</h3>
              <button onClick={() => navigate("/expedientes")} className="text-emerald-500 text-xs hover:text-emerald-400 transition">
                Ver expedientes
              </button>
            </div>
            {caso.documentos?.length === 0 ? (
              <div className="text-center py-8 text-gray-600 text-sm">No hay documentos en este caso</div>
            ) : (
              <div className="divide-y divide-gray-800">
                {caso.documentos?.map((d) => (
                  <div key={d.id} className="px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{tipoIcono(d.tipo)}</span>
                      <div>
                        <p className="text-white text-sm font-medium">{d.nombre}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{formatFecha(d.creadoEn)}</p>
                      </div>
                    </div>
                    <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-900/20 transition">
                      Ver
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}