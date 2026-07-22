import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Clientes from "./pages/clientes/Clientes";
import Casos from "./pages/casos/Casos";
import Agenda from "./pages/agenda/Agenda";
import Abogados from "./pages/abogados/Abogados";
import Expedientes from "./pages/expedientes/Expedientes";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
        <Route path="/casos" element={<PrivateRoute><Casos /></PrivateRoute>} />
        <Route path="/agenda" element={<PrivateRoute><Agenda /></PrivateRoute>} />
        <Route path="/abogados" element={<PrivateRoute><Abogados /></PrivateRoute>} />
        <Route path="/expedientes" element={<PrivateRoute><Expedientes /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;