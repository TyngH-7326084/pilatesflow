import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupLogin from "./pages/SignupLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";

function Schedule() {
  return (
    <>
      <Navbar />
      <h2>Member schedule (coming soon)</h2>
    </>
  );
}

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