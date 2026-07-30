import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario] = useState(() => {
    const data = localStorage.getItem("usuario");
    return data ? JSON.parse(data) : null;
  });

  const esdueno = usuario?.rol === "DUENO";
  const esSecretaria = usuario?.rol === "SECRETARIA";
  const esAbogado = usuario?.rol === "ABOGADO";

  return (
    <AuthContext.Provider value={{ usuario, esdueno, esSecretaria, esAbogado }}>
      {children}
    </AuthContext.Provider>
  );
}



export const useAuth = () => useContext(AuthContext);