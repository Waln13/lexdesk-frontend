import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getCitas, crearCita, actualizarCita, eliminarCita } from "../../services/citaService";
import { getCasos } from "../../services/casoService";

export default function Agenda() {
  const [citas, setCitas] = useState([]);
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ fecha: "", motivo: "", casoId: "", abogadoId: "" });

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const cargar = async () => {
    const [citasData, casosData] = await Promise.all([getCitas(), getCasos()]);
    setCitas(citasData);
    setCasos(casosData);
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const abrirModal = (cita = null) => {
    if (cita) {
      setEditando(cita);
      setForm({
        fecha: new Date(cita.fecha).toISOString().slice(0, 16),
        motivo: cita.motivo || "",
        casoId: cita.casoId,
        abogadoId: cita.abogadoId,
      });
    } else {
      setEditando(null);
      setForm({ fecha: "", motivo: "", casoId: "", abogadoId: usuario.id });
    }
    setModal(true);
  };

  const cerrarModal = () => { setModal(false); setEditando(null); };

  const handleSubmit = async () => {
    if (!form.fecha || !form.casoId || !form.abogadoId) return;
    if (editando) {
      await actualizarCita(editando.id, form);
    } else {
      await crearCita(form);
    }
    cerrarModal();
    cargar();
  };

  const handleCompletar = async (cita) => {
    await actualizarCita(cita.id, { completada: !cita.completada });
    cargar();
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar esta cita?")) return;
    await eliminarCita(id);
    cargar();
  };

  const citasHoy = citas.filter((c) => {
    const hoy = new Date().toDateString();
    return new Date(c.fecha).toDateString() === hoy;
  });

  const citasPendientes = citas.filter((c) => !c.completada);
  const citasCompletadas = citas.filter((c) => c.completada);

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-DO", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    });
  };

  const formatHora = (fecha) => {
    return new Date(fecha).toLocaleTimeString("es-DO", {
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Agenda</h2>
          <p className="text-gray-500 text-sm mt-1">
            {citasHoy.length} citas hoy · {citasPendientes.length} pendientes
          </p>
        </div>
        <button
          onClick={() => abrirModal()}
          className="bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
        >
          + Nueva Cita
        </button>
      </div>

      {/* Citas de hoy */}
      {citasHoy.length > 0 && (
        <div className="mb-6">
          <h3 className="text-emerald-500 text-xs uppercase tracking-widest mb-3 font-medium">Hoy</h3>
          <div className="grid gap-3">
            {citasHoy.map((c) => (
              <div key={c.id} className="bg-emerald-900/10 border border-emerald-800/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[50px]">
                    <p className="text-emerald-400 font-bold text-lg">{formatHora(c.fecha)}</p>
                  </div>
                  <div>
                    <p className="text-white font-medium">{c.caso?.titulo}</p>
                    <p className="text-gray-500 text-xs">{c.caso?.cliente?.nombre} · {c.abogado?.nombre}</p>
                    {c.motivo && <p className="text-gray-600 text-xs mt-0.5">{c.motivo}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCompletar(c)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-emerald-700/30 text-emerald-400 hover:bg-emerald-700/50 transition"
                  >
                    Completar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Todas las citas */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-white font-medium text-sm">Todas las citas</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
              <th className="text-left px-6 py-4">Fecha</th>
              <th className="text-left px-6 py-4">Hora</th>
              <th className="text-left px-6 py-4">Caso</th>
              <th className="text-left px-6 py-4">Cliente</th>
              <th className="text-left px-6 py-4">Abogado</th>
              <th className="text-left px-6 py-4">Estado</th>
              <th className="text-left px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-600">Cargando...</td></tr>
            ) : citas.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-600">No hay citas registradas</td></tr>
            ) : (
              citas.map((c) => (
                <tr key={c.id} className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition ${c.completada ? "opacity-50" : ""}`}>
                  <td className="px-6 py-4 text-gray-300">{formatFecha(c.fecha)}</td>
                  <td className="px-6 py-4 text-emerald-400 font-medium">{formatHora(c.fecha)}</td>
                  <td className="px-6 py-4 text-white">{c.caso?.titulo}</td>
                  <td className="px-6 py-4 text-gray-400">{c.caso?.cliente?.nombre}</td>
                  <td className="px-6 py-4 text-gray-400">{c.abogado?.nombre}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${c.completada ? "bg-gray-800 text-gray-500 border-gray-700" : "bg-blue-900/30 text-blue-400 border-blue-800/50"}`}>
                      {c.completada ? "Completada" : "Pendiente"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCompletar(c)}
                        className="text-gray-400 hover:text-emerald-400 text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-900/20 transition"
                      >
                        {c.completada ? "Reabrir" : "Completar"}
                      </button>
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
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-white font-semibold text-lg mb-6">
              {editando ? "Editar Cita" : "Nueva Cita"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">
                  Fecha y Hora <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">
                  Caso <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.casoId}
                  onChange={(e) => setForm({ ...form, casoId: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition"
                >
                  <option value="">Seleccionar caso</option>
                  {casos.map((c) => (
                    <option key={c.id} value={c.id}>{c.titulo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Motivo</label>
                <input
                  type="text"
                  value={form.motivo}
                  onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                  placeholder="Motivo de la cita"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition"
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
                {editando ? "Guardar cambios" : "Crear cita"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}