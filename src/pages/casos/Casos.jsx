import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getCasos, crearCaso, actualizarCaso, eliminarCaso } from "../../services/casoService";
import { getClientes } from "../../services/clienteService";
import { getUsuarios } from "../../services/usuarioService";

const ESTADOS = {
  NUEVO: { label: "Nuevo", color: "blue" },
  EN_PROCESO: { label: "En Proceso", color: "emerald" },
  PENDIENTE: { label: "Pendiente", color: "yellow" },
  CERRADO: { label: "Cerrado", color: "gray" },
};

const TIPOS = ["CONSULTA", "REPRESENTACION"];
const AREAS = ["Derecho Familiar", "Derecho Penal", "Derecho Civil", "Derecho Laboral", "Derecho Comercial", "Otro"];

const formatFecha = (fecha) => new Date(fecha).toLocaleDateString("es-DO", {
  day: "numeric", month: "short", year: "numeric",
});

export default function Casos() {
  const [casos, setCasos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [abogados, setAbogados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [form, setForm] = useState({
    titulo: "", descripcion: "", tipo: "CONSULTA",
    area: "", clienteId: "", estado: "NUEVO", abogadoId: "", numeroExpediente: "",
  });

  const cargar = async () => {
    const [casosData, clientesData, usuariosData] = await Promise.all([
      getCasos(), getClientes(), getUsuarios(),
    ]);
    setCasos(casosData);
    setClientes(clientesData);
    setAbogados(usuariosData.filter((u) => u.rol === "ABOGADO"));
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const casosFiltrados = casos.filter((c) => {
    const q = busqueda.toLowerCase();
    return (
      c.titulo?.toLowerCase().includes(q) ||
      c.numeroExpediente?.toLowerCase().includes(q) ||
      c.cliente?.nombre?.toLowerCase().includes(q) ||
      c.area?.toLowerCase().includes(q)
    );
  });

  const abrirModal = (caso = null) => {
    if (caso) {
      setEditando(caso);
      setForm({
        titulo: caso.titulo,
        descripcion: caso.descripcion || "",
        tipo: caso.tipo,
        area: caso.area || "",
        clienteId: caso.clienteId,
        estado: caso.estado,
        abogadoId: caso.abogadoId || "",
        numeroExpediente: caso.numeroExpediente || "",
      });
    } else {
      setEditando(null);
      setForm({ titulo: "", descripcion: "", tipo: "CONSULTA", area: "", clienteId: "", estado: "NUEVO", abogadoId: "", numeroExpediente: "" });
    }
    setModal(true);
  };

  const cerrarModal = () => { setModal(false); setEditando(null); };

  const handleSubmit = async () => {
    if (!form.titulo || !form.clienteId) return;
    if (editando) {
      await actualizarCaso(editando.id, form);
    } else {
      await crearCaso(form);
    }
    cerrarModal();
    cargar();
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este caso?")) return;
    await eliminarCaso(id);
    cargar();
  };

  const estadoBadge = (estado) => {
    const e = ESTADOS[estado];
    const colors = {
      blue: "bg-blue-900/30 text-blue-400 border-blue-800/50",
      emerald: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50",
      yellow: "bg-yellow-900/30 text-yellow-400 border-yellow-800/50",
      gray: "bg-gray-800 text-gray-500 border-gray-700",
    };
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full border ${colors[e.color]}`}>
        {e.label}
      </span>
    );
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Casos</h2>
          <p className="text-gray-500 text-sm mt-1">{casosFiltrados.length} casos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por título, expediente, cliente..."
              className="bg-gray-800 border border-gray-700 text-white rounded-lg pl-9 pr-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition w-72"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          </div>
          <button
            onClick={() => abrirModal()}
            className="bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
          >
            + Nuevo Caso
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
              <th className="text-left px-6 py-4">No. Expediente</th>
              <th className="text-left px-6 py-4">Título</th>
              <th className="text-left px-6 py-4">Cliente</th>
              <th className="text-left px-6 py-4">Tipo</th>
              <th className="text-left px-6 py-4">Área</th>
              <th className="text-left px-6 py-4">Abogado</th>
              <th className="text-left px-6 py-4">Estado</th>
              <th className="text-left px-6 py-4">Fecha</th>
              <th className="text-left px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center py-12 text-gray-600">Cargando...</td></tr>
            ) : casosFiltrados.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-12 text-gray-600">No hay casos registrados</td></tr>
            ) : (
              casosFiltrados.map((c) => (
                <tr key={c.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="px-6 py-4">
                    <span className="text-emerald-400 text-xs font-mono">
                      {c.numeroExpediente || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{c.titulo}</p>
                    {c.descripcion && <p className="text-gray-600 text-xs mt-0.5 truncate max-w-[200px]">{c.descripcion}</p>}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{c.cliente?.nombre || "—"}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500">
                      {c.tipo === "CONSULTA" ? "Consulta" : "Representación"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{c.area || "—"}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{c.abogado?.nombre || "Sin asignar"}</td>
                  <td className="px-6 py-4">{estadoBadge(c.estado)}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{formatFecha(c.creadoEn)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => abrirModal(c)}
                        className="text-gray-400 hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(c.id)}
                        className="text-gray-600 hover:text-red-400 text-xs px-3 py-1.5 rounded-lg hover:bg-red-900/20 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-white font-semibold text-lg mb-6">
              {editando ? "Editar Caso" : "Nuevo Caso"}
            </h3>

            {editando && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 mb-4 flex items-center justify-between">
                <span className="text-gray-500 text-xs uppercase tracking-wider">Creado el</span>
                <span className="text-gray-300 text-xs">{formatFecha(editando.creadoEn)}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">
                  No. Expediente
                </label>
                <input
                  type="text"
                  value={form.numeroExpediente}
                  onChange={(e) => setForm({ ...form, numeroExpediente: e.target.value })}
                  placeholder="Ej: EXP-2026-001"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition font-mono"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ej: Caso divorcio García"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">
                  Cliente <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.clienteId}
                  onChange={(e) => setForm({ ...form, clienteId: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition"
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">
                    Tipo
                  </label>
                  <p className="text-gray-600 text-xs mb-2">¿Es una consulta puntual o el abogado va a representar al cliente?</p>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition"
                  >
                    {TIPOS.map((t) => (
                      <option key={t} value={t}>{t === "CONSULTA" ? "Consulta" : "Representación"}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">
                    Estado
                  </label>
                  <p className="text-gray-600 text-xs mb-2">¿En qué etapa está el caso actualmente?</p>
                  <select
                    value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition"
                  >
                    {Object.entries(ESTADOS).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Área</label>
                <select
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition"
                >
                  <option value="">Seleccionar área</option>
                  {AREAS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Abogado asignado</label>
                <select
                  value={form.abogadoId}
                  onChange={(e) => setForm({ ...form, abogadoId: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition"
                >
                  <option value="">Sin asignar</option>
                  {abogados.map((a) => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Detalles del caso..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={cerrarModal}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium py-2.5 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-lg transition"
              >
                {editando ? "Guardar cambios" : "Crear caso"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}