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
            <h3 className="text-white font-medium text-sm">Casos</h3>
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-600 text-sm">Cargando...</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {casos.map((c) => (
                <button
                  key={c.id}
                  onClick={() => seleccionarCaso(c)}
                  className={`w-full text-left px-5 py-4 hover:bg-gray-800/50 transition ${casoSeleccionado?.id === c.id ? "bg-emerald-900/10 border-l-2 border-emerald-600" : ""}`}
                >
                  <p className={`text-sm font-medium ${casoSeleccionado?.id === c.id ? "text-emerald-400" : "text-white"}`}>
                    {c.titulo}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">{c.cliente?.nombre}</p>
                </button>
              ))}
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
              <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium text-sm">{casoSeleccionado.titulo}</h3>
                  <p className="text-gray-500 text-xs mt-0.5">{documentos.length} documentos</p>
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

              {documentos.length === 0 ? (
                <div className="text-center py-16 text-gray-600 text-sm">
                  No hay documentos en este expediente
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {documentos.map((d) => (
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