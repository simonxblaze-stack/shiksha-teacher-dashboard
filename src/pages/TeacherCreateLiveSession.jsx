import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/apiClient";

export default function TeacherCreateLiveSession() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (!form.title || !form.start_time || !form.end_time) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/livestream/sessions/", {
        title: form.title,
        description: form.description,
        subject_id: subjectId, // ✅ backend expects this
        start_time: new Date(form.start_time).toISOString(), // ✅ correct ISO format
        end_time: new Date(form.end_time).toISOString(),
      });

      navigate(-1);
    } catch (err) {
      console.error(err.response?.data);

      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Failed to create session.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Live Session</h2>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <br /><br />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <br /><br />

      <input
        type="datetime-local"
        value={form.start_time}
        onChange={(e) =>
          setForm({
            ...form,
            start_time: e.target.value,
          })
        }
      />

      <br /><br />

      <input
        type="datetime-local"
        value={form.end_time}
        onChange={(e) =>
          setForm({
            ...form,
            end_time: e.target.value,
          })
        }
      />

      <br /><br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create Session"}
      </button>
    </div>
  );
}