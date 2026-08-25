import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // "admin" | "member" | null

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="PilatesFlow logo" className="app-logo" />
        <span>PilatesFlow</span>
      </div>
      <div className="navbar-status">
        {role ? (
          <>
            <span>Logged in as {role === "admin" ? "Admin" : "Member"}</span>
            <button className="btn-ghost" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <span>Guest</span>
        )}
      </div>
    </header>
  );
}