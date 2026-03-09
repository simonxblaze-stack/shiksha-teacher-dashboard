import { useNavigate, useParams } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../api/apiClient";
import "../styles/submission-view.css";

export default function SubmissionView() {

  const navigate = useNavigate();
  const { subjectId, assignmentId } = useParams();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const backPath = `/teacher/classes/${subjectId}/assignments`;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {

    async function fetchSubmissions() {

      try {

        const res = await api.get(
          `/assignments/teacher/${assignmentId}/submissions/`
        );

        const formatted = res.data.map((s) => ({
          id: s.id,
          name: s.student_name,
          submittedOn: s.submitted_at,
          status: s.submitted_file ? "Submitted" : "Pending",
          file: s.submitted_file,
        }));

        setStudents(formatted);

      } catch (err) {
        console.error("Failed to load submissions", err);
      } finally {
        setLoading(false);
      }
    }

    if (assignmentId) fetchSubmissions();

  }, [assignmentId]);

  const total = students.length;
  const submittedCount = students.filter(
    (s) => s.status === "Submitted"
  ).length;

  const pendingCount = total - submittedCount;

  if (loading) return <div>Loading submissions...</div>;

  return (
    <div className="sv-page">

      <button
        className="sv-back-btn"
        onClick={() => navigate(backPath)}
      >
        <IoChevronBack /> Back
      </button>

      <div className="sv-header">

        <h2 className="sv-title">
          Assignment Submissions
        </h2>

        <div className="sv-search">
          <input type="text" placeholder="Search" />
          <FiSearch className="sv-search-icon" />
        </div>

      </div>

      <div className="sv-content-card">

        <div className="sv-summary">
          <span className="sv-submitted-count">
            {submittedCount}/{total} Submitted
          </span>

          <span className="sv-pending-count">
            {pendingCount}/{total} Pending
          </span>
        </div>

        <table className="sv-table">

          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Name</th>
              <th>Submitted On</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {students.map((student, index) => (
              <tr key={student.id}>

                <td>{index + 1}</td>

                <td>{student.name}</td>

                <td>{formatDate(student.submittedOn)}</td>

                <td>
                  <span
                    className={
                      student.status === "Submitted"
                        ? "sv-status-submitted"
                        : "sv-status-pending"
                    }
                  >
                    {student.status}
                  </span>
                </td>

                <td>
                  {student.file && (
                    <a
                      href={student.file}
                      target="_blank"
                      rel="noreferrer"
                      className="sv-review-btn"
                    >
                      Review
                    </a>
                  )}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}