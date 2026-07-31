import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import API from "../../config";

const getToken = () => localStorage.getItem("token");

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: "", passwordActual: "", passwordNuevo: "", passwordConfirm: "" });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    const res = await fetch(`${API}/perfil`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    setPerfil(data);
    setForm((f) => ({ ...f, nombre: data.nombre }));
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const handleSubmit = async () => {
    setMensaje("");
    setError("");

    if (form.passwordNuevo && form.passwordNuevo !== form.passwordConfirm) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }

    setGuardando(true);
    const res = await fetch(`${API}/perfil`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: form.nombre,
        passwordActual: form.passwordActual || undefined,
        passwordNuevo: form.passwordNuevo || undefined,
      }),
    });

    const data = await res.json();
    setGuardando(false);

    if (!res.ok) {
      setError(data.message);
      return;
    }

    // Actualizar nombre en localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    localStorage.setItem("usuario", JSON.stringify({ ...usuario, nombre: form.nombre }));

    setMensaje("Perfil actualizado correctamente");
    setForm((f) => ({ ...f, passwordActual: "", passwordNuevo: "", passwordConfirm: "" }));
  };

  const formatFecha = (fecha) => new Date(fecha).toLocaleDateString("es-DO", {
    day: "numeric", month: "long", year: "numeric",
  });

  const rolLabel = (rol) => {
    if (rol === "DUENO") return "Dueño";
    if (rol === "SECRETARIA") return "Secretaria";
    return "Abogado";
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Mi Perfil</h2>
        <p className="text-gray-500 text-sm mt-1">Gestiona tu información personal</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-600">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Tarjeta de perfil */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-yellow-700/20 border-2 border-yellow-700/40 flex items-center justify-center text-yellow-400 text-3xl font-bold mb-4">
              {perfil?.nombre?.charAt(0)}
            </div>
            <p className="text-white font-semibold text-lg">{perfil?.nombre}</p>
            <p className="text-gray-500 text-sm mt-1">{perfil?.email}</p>
            <span className="mt-3 bg-yellow-700/20 text-yellow-400 border border-yellow-700/30 text-xs px-3 py-1 rounded-full">
              {rolLabel(perfil?.rol)}
            </span>
            <div className="mt-6 pt-6 border-t border-gray-800 w-full">
              <p className="text-gray-600 text-xs">Miembro desde</p>
              <p className="text-gray-400 text-sm mt-1">{formatFecha(perfil?.creadoEn)}</p>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-6">Editar información</h3>

            {mensaje && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg px-4 py-3 mb-6">
                {mensaje}
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">
                  Email
                </label>
                <input
                  type="text"
                  value={perfil?.email}
                  disabled
                  className="w-full bg-gray-800/50 border border-gray-700/50 text-gray-500 rounded-lg px-4 py-2.5 text-sm cursor-not-allowed"
                />
              </div>

              <div className="pt-4 border-t border-gray-800">
                <p className="text-white text-sm font-medium mb-4">Cambiar contraseña</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      value={form.passwordActual}
                      onChange={(e) => setForm({ ...form, passwordActual: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">
                        Nueva contraseña
                      </label>
                      <input
                        type="password"
                        value={form.passwordNuevo}
                        onChange={(e) => setForm({ ...form, passwordNuevo: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">
                        Confirmar contraseña
                      </label>
                      <input
                        type="password"
                        value={form.passwordConfirm}
                        onChange={(e) => setForm({ ...form, passwordConfirm: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                disabled={guardando}
                className="bg-emerald-700 hover:bg-emerald-600 disabled:bg-emerald-900 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition"
              >
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}