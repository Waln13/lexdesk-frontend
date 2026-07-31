console.log("ENV:", import.meta.env.VITE_API_URL);
console.log("MODE:", import.meta.env.MODE);

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default API;