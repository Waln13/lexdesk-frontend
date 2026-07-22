import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al iniciar sesión");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      navigate("/dashboard");
    } catch (err) {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Fondo decorativo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-emerald-900/10 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-emerald-900/10 blur-3xl" />
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 80px)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none">
          <p className="text-white text-[120px] font-serif font-bold tracking-widest rotate-[-15deg]">
            IUSTITIA
          </p>
        </div>
      </div>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-10 select-none pointer-events-none text-white text-5xl">
        ⚖
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-12 bg-emerald-700/60" />
            <span className="text-emerald-600/80 text-xs tracking-[0.3em] uppercase font-medium">
              Sistema Legal
            </span>
            <div className="h-px w-12 bg-emerald-700/60" />
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight font-serif">
            Lex<span className="text-emerald-500">Desk</span>
          </h1>
          <p className="text-gray-500 mt-2 text-xs tracking-widest uppercase">
            Gestión de Firma de Abogados
          </p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800/80 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-emerald-800/50" />
            <span className="text-emerald-600/60 text-xs tracking-widest uppercase">Acceso</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-emerald-800/50" />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-400 text-xs mb-1.5 block tracking-wider uppercase">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="ejemplo@lexdesk.com"
                className="w-full bg-gray-800/80 border border-gray-700/80 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 transition"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1.5 block tracking-wider uppercase">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-gray-800/80 border border-gray-700/80 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-600 disabled:bg-emerald-900 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-2.5 text-sm tracking-wide transition mt-2"
            >
              {loading ? "Verificando..." : "Ingresar al Sistema"}
            </button>
          </form>

          <div className="flex items-center gap-3 mt-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-800" />
            <span className="text-gray-700 text-xs">⚖</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-800" />
          </div>
        </div>

        <p className="text-center text-gray-700 text-xs mt-6 tracking-widest uppercase">
          LexDesk © {new Date().getFullYear()} — Confidencial
        </p>
      </div>
    </div>
  );
}