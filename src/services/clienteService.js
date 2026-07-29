const API = "import.meta.env.VITE_API_URL";

const getToken = () => localStorage.getItem("token");

export const getClientes = async () => {
  const res = await fetch(`${API}/clientes`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const crearCliente = async (data) => {
  const res = await fetch(`${API}/clientes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const actualizarCliente = async (id, data) => {
  const res = await fetch(`${API}/clientes/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const eliminarCliente = async (id) => {
  const res = await fetch(`${API}/clientes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};