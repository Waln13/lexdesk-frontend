const API = "import.meta.env.VITE_API_URL";
const getToken = () => localStorage.getItem("token");

export const getCitas = async () => {
  const res = await fetch(`${API}/citas`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const crearCita = async (data) => {
  const res = await fetch(`${API}/citas`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const actualizarCita = async (id, data) => {
  const res = await fetch(`${API}/citas/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const eliminarCita = async (id) => {
  const res = await fetch(`${API}/citas/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};