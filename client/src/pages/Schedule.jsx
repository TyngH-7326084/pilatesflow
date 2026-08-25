import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API = import.meta.env.VITE_API_URL ?? "";

export default function Schedule() {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const { data } = await axios.get(`${API}/api/classes`);
        const now = new Date();
        const sevenDaysOut = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        // AC: display upcoming classes only (next 7 days, matching wireframe)
        const upcoming = data.filter((c) => {
          const classTime = new Date(c.classDateTime);
          return classTime >= now && classTime <= sevenDaysOut;
        });

        setClasses(upcoming);
      } catch (err) {
        setError("Could not load the schedule. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadClasses();
  }, []);

  return (
    <>
      <Navbar />
      <div className="schedule-page">
        <h2 className="class-list-title">Next 7 Days</h2>
        <p className="schedule-subtitle">
          Browse the schedule. Sign up to reserve a spot.
        </p>

        {loading && <p>Loading schedule...</p>}
        {error && <p role="alert" className="auth-error">{error}</p>}

        {!loading && !error && classes.length === 0 && (
          <p>No classes scheduled in the next 7 days.</p>
        )}

        {!loading && classes.length > 0 && (
          <ul className="class-list">
            {classes.map((c) => (
              <li key={c._id} className="class-list-item">
                <div>
                  <strong>{c.className}</strong>
                  <p className="class-meta">
                    {c.instructorName} ·{" "}
                    {new Date(c.classDateTime).toLocaleString(undefined, {
                      weekday: "short",
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {/* Note: no booking-count tracking yet, so "spots" reflects
                    total capacity for now — see decision log 25 Aug. */}
                <span className="class-capacity">{c.capacity} spots available</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}