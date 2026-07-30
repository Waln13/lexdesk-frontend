import API from "../config";
const getToken = () => localStorage.getItem("token");

export const getUsuarios = async () => {
  const res = await fetch(`${API}/usuarios`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const crearUsuario = async (data) => {
  const res = await fetch(`${API}/usuarios`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const actualizarUsuario = async (id, data) => {
  const res = await fetch(`${API}/usuarios/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const eliminarUsuario = async (id) => {
  const res = await fetch(`${API}/usuarios/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};