import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API = import.meta.env.VITE_API_URL ?? "";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancelMessage, setCancelMessage] = useState("");
  const [cancelling, setCancelling] = useState(null);

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API}/api/bookings/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(data);
    } catch (err) {
      setError("Could not load your bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    setCancelling(bookingId);
    setCancelMessage("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCancelMessage("Booking cancelled.");
      await loadBookings();
    } catch (err) {
      setCancelMessage(err.response?.data?.error || "Could not cancel booking.");
    } finally {
      setCancelling(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="schedule-page">
        <h2 className="class-list-title">My Bookings</h2>
        <p className="schedule-subtitle">
          Manage the classes you've reserved a spot in.
        </p>

        {loading && <p>Loading your bookings...</p>}
        {error && <p role="alert" className="auth-error">{error}</p>}
        {cancelMessage && (
          <p role="alert" className="success-banner">{cancelMessage}</p>
        )}

        {!loading && !error && bookings.length === 0 && (
          <p>You haven't booked any classes yet.</p>
        )}

        {!loading && bookings.length > 0 && (
          <ul className="class-list">
            {bookings.map((b) => (
              <li key={b._id} className="class-list-item">
                <div>
                  <strong>{b.class.className}</strong>
                  <p className="class-meta">
                    {b.class.instructorName} ·{" "}
                    {new Date(b.class.classDateTime).toLocaleString(undefined, {
                      weekday: "short",
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <button
                  className="btn-ghost"
                  onClick={() => handleCancel(b._id)}
                  disabled={cancelling === b._id}
                >
                  {cancelling === b._id ? "Cancelling..." : "Cancel"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}