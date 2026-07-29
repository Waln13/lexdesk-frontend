import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getCasos } from "../../services/casoService";
import { getDocumentos, subirDocumento, eliminarDocumento } from "../../services/documentoService";

const tipoIcono = (tipo) => {
  if (tipo?.includes("pdf")) return "📄";
  if (tipo?.includes("image")) return "🖼";
  if (tipo?.includes("word")) return "📝";
  return "📎";
};

export default function Expedientes() {
  const [casos, setCasos] = useState([]);
  const [casoSeleccionado, setCasoSeleccionado] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [busquedaCasos, setBusquedaCasos] = useState("");
  const [busquedaDocs, setBusquedaDocs] = useState("");

  const cargarCasos = async () => {
    const data = await getCasos();
    setCasos(data);
    setLoading(false);
  };

  const cargarDocumentos = async (casoId) => {
    const data = await getDocumentos(casoId);
    setDocumentos(data);
  };

  useEffect(() => { cargarCasos(); }, []);

  const seleccionarCaso = async (caso) => {
    setCasoSeleccionado(caso);
    setBusquedaDocs("");
    await cargarDocumentos(caso.id);
  };

  const handleSubir = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo || !casoSeleccionado) return;
    setSubiendo(true);
    await subirDocumento(casoSeleccionado.id, archivo);
    await cargarDocumentos(casoSeleccionado.id);
    setSubiendo(false);
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este documento?")) return;
    await eliminarDocumento(id);
    await cargarDocumentos(casoSeleccionado.id);
  };

  const formatFecha = (fecha) => new Date(fecha).toLocaleDateString("es-DO", {
    day: "numeric", month: "short", year: "numeric",
  });

  const casosFiltrados = casos.filter((c) => {
    const q = busquedaCasos.toLowerCase();
    return (
      c.titulo?.toLowerCase().includes(q) ||
      c.numeroExpediente?.toLowerCase().includes(q) ||
      c.cliente?.nombre?.toLowerCase().includes(q)
    );
  });

  const docsFiltrados = documentos.filter((d) =>
    d.nombre?.toLowerCase().includes(busquedaDocs.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Expedientes</h2>
        <p className="text-gray-500 text-sm mt-1">Documentos organizados por caso</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Lista de casos */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="text-white font-medium text-sm mb-3">Casos</h3>
            <div className="relative">
              <input
                type="text"
                value={busquedaCasos}
                onChange={(e) => setBusquedaCasos(e.target.value)}
                placeholder="Buscar caso..."
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-8 pr-3 py-2 text-xs placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">🔍</span>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-600 text-sm">Cargando...</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {casosFiltrados.length === 0 ? (
                <div className="text-center py-8 text-gray-600 text-xs">Sin resultados</div>
              ) : (
                casosFiltrados.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => seleccionarCaso(c)}
                    className={`w-full text-left px-5 py-4 hover:bg-gray-800/50 transition ${casoSeleccionado?.id === c.id ? "bg-emerald-900/10 border-l-2 border-emerald-600" : ""}`}
                  >
                    <p className={`text-sm font-medium ${casoSeleccionado?.id === c.id ? "text-emerald-400" : "text-white"}`}>
                      {c.titulo}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-gray-500 text-xs">{c.cliente?.nombre}</p>
                      {c.numeroExpediente && (
                        <span className="text-emerald-700 text-xs font-mono">{c.numeroExpediente}</span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Documentos del caso */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {!casoSeleccionado ? (
            <div className="flex items-center justify-center h-full py-20 text-gray-600 text-sm">
              Selecciona un caso para ver sus documentos
            </div>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium text-sm">{casoSeleccionado.titulo}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">{docsFiltrados.length} documentos</p>
                  </div>
                  <label className={`cursor-pointer bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition ${subiendo ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {subiendo ? "Subiendo..." : "+ Subir documento"}
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleSubir}
                      disabled={subiendo}
                    />
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={busquedaDocs}
                    onChange={(e) => setBusquedaDocs(e.target.value)}
                    placeholder="Buscar documento..."
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-8 pr-3 py-2 text-xs placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition"
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">🔍</span>
                </div>
              </div>

              {docsFiltrados.length === 0 ? (
                <div className="text-center py-16 text-gray-600 text-sm">
                  {busquedaDocs ? "Sin resultados" : "No hay documentos en este expediente"}
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {docsFiltrados.map((d) => (
                    <div key={d.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-800/30 transition">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tipoIcono(d.tipo)}</span>
                        <div>
                          <p className="text-white text-sm font-medium">{d.nombre}</p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {d.subidoPor?.nombre} · {formatFecha(d.creadoEn)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-900/20 transition">
                          Ver
                        </a>
                        <button
                          onClick={() => handleEliminar(d.id)}
                          className="text-gray-600 hover:text-red-400 text-xs px-3 py-1.5 rounded-lg hover:bg-red-900/20 transition"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}