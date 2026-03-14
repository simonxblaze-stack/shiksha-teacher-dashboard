import { useNavigate, useParams } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../api/apiClient";
import "../styles/session-recordings.css";

export default function SessionRecordings() {

  const navigate = useNavigate();
  const { subjectId } = useParams();

  const [recordings, setRecordings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchRecordings() {

      try {

        const res = await api.get(
          `/courses/subjects/${subjectId}/recordings/`
        );

        setRecordings(res.data || []);

      } catch (err) {

        console.error("Failed to load recordings", err);
        setRecordings([]);

      } finally {

        setLoading(false);

      }

    }

    if (subjectId) fetchRecordings();

  }, [subjectId]);

  const filtered = recordings.filter((rec) =>
    rec.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="sr-page">

      <button
        className="sr-back-btn"
        onClick={() => navigate(-1)}
      >
        <IoChevronBack /> Back
      </button>

      <div className="sr-content">

        <div className="sr-header">

          <h2 className="sr-title">Session Recordings</h2>

          <div className="sr-search">

            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <FiSearch className="sr-search-icon" />

          </div>

        </div>

        <div className="sr-actions">

          <button
            className="sr-add-btn"
            onClick={() =>
              navigate(`/teacher/classes/${subjectId}/session-recordings/upload`)
            }
          >
            + Add Session Recording
          </button>

        </div>

        <div className="sr-grid">

          {loading && <p>Loading recordings...</p>}

          {!loading && filtered.length === 0 && (
            <p style={{ opacity: 0.6 }}>
              No recordings uploaded yet.
            </p>
          )}

          {filtered.map((rec) => (

            <div className="sr-card" key={rec.id}>

              <h4 className="sr-card-subject">
                Session
              </h4>

              <p className="sr-card-topic">
                {rec.title}
              </p>

              <p className="sr-card-teacher">
                Teacher
              </p>

              <div className="sr-card-bottom">

                <span className="sr-card-date">
                  {rec.session_date}
                </span>

                <span className="sr-card-duration">
                  {rec.duration || ""}
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}