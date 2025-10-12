import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/admin/Admin";
import PresentPage from "./pages/PresentPage";

export default function App() {
  return (
   <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
         <Route path="/present/:id" element={<PresentPage />} /> 
      </Routes>
    </Router>
  );
}
