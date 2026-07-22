import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from "../../services/usuarioService";

const ROLES = ["ABOGADO", "SECRETARIA", "DUENO"];

const rolBadge = (rol) => {
  const config = {
    DUENO: "bg-purple-900/30 text-purple-400 border-purple-800/50",
    SECRETARIA: "bg-blue-900/30 text-blue-400 border-blue-800/50",
    ABOGADO: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50",
  };
  const labels = { DUENO: "Dueño", SECRETARIA: "Secretaria", ABOGADO: "Abogado" };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border ${config[rol]}`}>
      {labels[rol]}
    </span>
  );
};

export default function Abogados() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: "", email: "", password: "", rol: "ABOGADO", activo: true });

  const cargar = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const abrirModal = (usuario = null) => {
    if (usuario) {
      setEditando(usuario);
      setForm({ nombre: usuario.nombre, email: usuario.email, password: "", rol: usuario.rol, activo: usuario.activo });
    } else {
      setEditando(null);
      setForm({ nombre: "", email: "", password: "", rol: "ABOGADO", activo: true });
    }
    setModal(true);
  };

  const cerrarModal = () => { setModal(false); setEditando(null); };

  const handleSubmit = async () => {
    if (!form.nombre || !form.email) return;
    if (!editando && !form.password) return;
    if (editando) {
      const { password, ...data } = form;
      await actualizarUsuario(editando.id, data);
    } else {
      await crearUsuario(form);
    }
    cerrarModal();
    cargar();
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    await eliminarUsuario(id);
    cargar();
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Abogados</h2>
          <p className="text-gray-500 text-sm mt-1">{usuarios.length} usuarios registrados</p>
        </div>
        <button
          onClick={() => abrirModal()}
          className="bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* Grid de usuarios */}
      {loading ? (
        <div className="text-center py-12 text-gray-600">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {usuarios.map((u) => (
            <div key={u.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-700/20 border border-emerald-700/30 flex items-center justify-center text-emerald-400 font-bold">
                    {u.nombre.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{u.nombre}</p>
                    <p className="text-gray-500 text-xs">{u.email}</p>
                  </div>
                </div>
                {rolBadge(u.rol)}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${u.activo ? "bg-emerald-500" : "bg-gray-600"}`} />
                  <span className="text-gray-500 text-xs">{u.activo ? "Activo" : "Inactivo"}</span>
                </div>
                <span className="text-gray-600 text-xs">{u.casos?.length || 0} casos</span>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
                <button
                  onClick={() => abrirModal(u)}
                  className="flex-1 text-gray-400 hover:text-white text-xs py-1.5 rounded-lg hover:bg-gray-800 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(u.id)}
                  className="flex-1 text-gray-600 hover:text-red-400 text-xs py-1.5 rounded-lg hover:bg-red-900/20 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-white font-semibold text-lg mb-6">
              {editando ? "Editar Usuario" : "Nuevo Usuario"}
            </h3>

            <div className="space-y-4">
              {[
                { label: "Nombre", key: "nombre", placeholder: "Nombre completo", required: true },
                { label: "Email", key: "email", placeholder: "correo@lexdesk.com", required: true },
                { label: "Contraseña", key: "password", placeholder: editando ? "Dejar vacío para no cambiar" : "Contraseña", required: !editando },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={field.key === "password" ? "password" : "text"}
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition"
                  />
                </div>
              ))}

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Rol</label>
                <select
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r === "DUENO" ? "Dueño" : r === "SECRETARIA" ? "Secretaria" : "Abogado"}
                    </option>
                  ))}
                </select>
              </div>

              {editando && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="activo"
                    checked={form.activo}
                    onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600"
                  />
                  <label htmlFor="activo" className="text-gray-400 text-sm">Usuario activo</label>
                </div>
              )}
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
                {editando ? "Guardar cambios" : "Crear usuario"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}