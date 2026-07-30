const API = import.meta.env.DEV 
  ? "http://localhost:3000/api"
  : "https://lexdesk-backend-63ad.onrender.com/api";

export default API;