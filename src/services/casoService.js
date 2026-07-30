import API from "../config";
const getToken = () => localStorage.getItem("token");

export const getCasos = async () => {
  const res = await fetch(`${API}/casos`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const crearCaso = async (data) => {
  const res = await fetch(`${API}/casos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const actualizarCaso = async (id, data) => {
  const res = await fetch(`${API}/casos/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const eliminarCaso = async (id) => {
  const res = await fetch(`${API}/casos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};