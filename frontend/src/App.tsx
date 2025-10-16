import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/admin/Admin";
import PresentPage from "./pages/PresentPage";
import PresentesEntregues from "./pages/admin/PresentesEntregues"; // 👈 importa aqui

export default function App() {
  return (
   <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
         <Route path="/present/:id" element={<PresentPage />} /> 
         <Route path="/admin/presentes-entregues" element={<PresentesEntregues />} /> {/* 👈 nova rota */}
      </Routes>
    </Router>
  );
}
