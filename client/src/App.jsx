import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupLogin from "./pages/SignupLogin";
import Schedule from "./pages/Schedule";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignupLogin />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;