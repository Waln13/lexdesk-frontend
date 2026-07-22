const API = "http://localhost:3000/api";
const getToken = () => localStorage.getItem("token");

export const getDocumentos = async (casoId) => {
  const res = await fetch(`${API}/documentos/${casoId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const subirDocumento = async (casoId, archivo) => {
  const formData = new FormData();
  formData.append("archivo", archivo);
  const res = await fetch(`${API}/documentos/${casoId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return res.json();
};

export const eliminarDocumento = async (id) => {
  const res = await fetch(`${API}/documentos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};