import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getClientes, crearCliente, actualizarCliente, eliminarCliente } from "../../services/clienteService";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "", direccion: "" });

  const cargar = async () => {
    const data = await getClientes();
    setClientes(data);
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const abrirModal = (cliente = null) => {
    if (cliente) {
      setEditando(cliente);
      setForm({ nombre: cliente.nombre, telefono: cliente.telefono || "", email: cliente.email || "", direccion: cliente.direccion || "" });
    } else {
      setEditando(null);
      setForm({ nombre: "", telefono: "", email: "", direccion: "" });
    }
    setModal(true);
  };

  const cerrarModal = () => {
    setModal(false);
    setEditando(null);
  };

  const handleSubmit = async () => {
    if (!form.nombre) return;
    if (editando) {
      await actualizarCliente(editando.id, form);
    } else {
      await crearCliente(form);
    }
    cerrarModal();
    cargar();
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este cliente?")) return;
    await eliminarCliente(id);
    cargar();
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Clientes</h2>
          <p className="text-gray-500 text-sm mt-1">{clientes.length} clientes registrados</p>
        </div>
        <button
          onClick={() => abrirModal()}
          className="bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
              <th className="text-left px-6 py-4">Nombre</th>
              <th className="text-left px-6 py-4">Teléfono</th>
              <th className="text-left px-6 py-4">Email</th>
              <th className="text-left px-6 py-4">Casos</th>
              <th className="text-left px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-600">Cargando...</td>
              </tr>
            ) : clientes.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-600">No hay clientes registrados</td>
              </tr>
            ) : (
              clientes.map((c) => (
                <tr key={c.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-700/20 border border-emerald-700/30 flex items-center justify-center text-emerald-400 text-xs font-bold">
                        {c.nombre.charAt(0)}
                      </div>
                      <span className="text-white font-medium">{c.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{c.telefono || "—"}</td>
                  <td className="px-6 py-4 text-gray-400">{c.email || "—"}</td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-700/20 text-emerald-400 text-xs px-2 py-1 rounded-full">
                      {c.casos?.length || 0} casos
                    </span>
                  </td>
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
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-white font-semibold text-lg mb-6">
              {editando ? "Editar Cliente" : "Nuevo Cliente"}
            </h3>

            <div className="space-y-4">
              {[
                { label: "Nombre", key: "nombre", placeholder: "Nombre completo", required: true },
                { label: "Teléfono", key: "telefono", placeholder: "809-555-0000" },
                { label: "Email", key: "email", placeholder: "correo@ejemplo.com" },
                { label: "Dirección", key: "direccion", placeholder: "Ciudad, RD" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition"
                  />
                </div>
              ))}
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
                {editando ? "Guardar cambios" : "Crear cliente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}