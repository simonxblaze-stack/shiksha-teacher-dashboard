import { useEffect, useState } from "react";
import api from "../api/apiClient";
import "../styles/profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profRes, formRes] = await Promise.all([
          api.get("/accounts/teacher/profile/"),
          api.get("/accounts/form-fillup/"),
        ]);
        setProfile(profRes.data);
        setForm(formRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="tp-page">
        <p className="tp-loading">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile || !form) {
    return (
      <div className="tp-page">
        <p className="tp-error">{error || "Profile not found."}</p>
      </div>
    );
  }

  const prefix =
    profile.gender === "female" ? "Miss" :
    profile.gender === "male" ? "Mr." : "";

  const displayName = prefix ? `${prefix} ${profile.name}` : profile.name;

  const formatDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    if (isNaN(dt)) return "—";
    return dt.toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  const val = (v) => (v === null || v === undefined || v === "" ? "—" : v);

  return (
    <div className="tp-page">

      {/* ===== TOP CARD ===== */}
      <div className="tp-top-card">
        <div className="tp-top-left">
          <div className="tp-avatar">
            {profile.photo ? (
              <img src={profile.photo} alt={profile.name} />
            ) : (
              <span className="tp-avatar-placeholder">
                {profile.name?.charAt(0) || "T"}
              </span>
            )}
          </div>

          <div className="tp-info">
            <h1 className="tp-name">{displayName || "Teacher"}</h1>

            <div className="tp-badges">
              {profile.highest_degree && profile.field_of_study && (
                <span className="tp-badge-item">
                  {profile.highest_degree} in {profile.field_of_study}
                </span>
              )}
              {profile.teaching_certifications?.map((cert, i) => (
                <span key={i} className="tp-badge-item">{cert}</span>
              ))}
            </div>

            {profile.experience_range && (
              <p className="tp-experience">
                {profile.experience_range} experience
              </p>
            )}

            <div className="tp-tags">
              {profile.is_approved && (
                <span className="tp-tag approved">Approved</span>
              )}
              {profile.employment_status && (
                <span className="tp-tag employment">{profile.employment_status}</span>
              )}
            </div>
          </div>
        </div>

        <div className="tp-top-right">
          <button
            className="tp-edit-btn"
            onClick={() => window.location.href = (import.meta.env.VITE_HOME_URL || "https://www.shikshacom.com") + "/form-fillup"}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* ===== RATING SECTION ===== */}
      <div className="tp-ratings-row">
        <div className="tp-rating-card">
          <h3>Overall Rating</h3>
          <div className="tp-rating-value">
            <span className="tp-star">&#9733;</span>
            <span className="tp-rating-number">
              {profile.rating ? profile.rating.toFixed(1) : "N/A"}
            </span>
            {profile.rating && <span className="tp-rating-max">/5.0</span>}
          </div>
          <p className="tp-rating-sub">Based on all student reviews</p>
        </div>

        <div className="tp-rating-card">
          <h3>Private Session Rating</h3>
          <div className="tp-rating-value">
            <span className="tp-star">&#9733;</span>
            <span className="tp-rating-number">N/A</span>
          </div>
          <p className="tp-rating-sub">Coming soon</p>
        </div>
      </div>

      {/* ===== BASIC DETAILS ===== */}
      <div className="tp-section">
        <h2>Basic Details</h2>
        <div className="tp-field-grid">
          <div className="tp-field"><span className="tp-field-label">Username</span><span className="tp-field-value">{val(form.username)}</span></div>
          <div className="tp-field"><span className="tp-field-label">Email</span><span className="tp-field-value">{val(form.email)}</span></div>
          <div className="tp-field"><span className="tp-field-label">First Name</span><span className="tp-field-value">{val(form.first_name)}</span></div>
          <div className="tp-field"><span className="tp-field-label">Last Name</span><span className="tp-field-value">{val(form.last_name)}</span></div>
          <div className="tp-field"><span className="tp-field-label">Phone Number</span><span className="tp-field-value">{val(form.phone)}</span></div>
          <div className="tp-field"><span className="tp-field-label">Date of Birth</span><span className="tp-field-value">{formatDate(form.date_of_birth)}</span></div>
          <div className="tp-field"><span className="tp-field-label">Gender</span><span className="tp-field-value tp-cap">{val(form.gender)}</span></div>
        </div>
      </div>

      {/* ===== ADDRESS ===== */}
      <div className="tp-section">
        <h2>Address</h2>
        <div className="tp-field-grid">
          <div className="tp-field"><span className="tp-field-label">State</span><span className="tp-field-value">{val(form.state)}</span></div>
          <div className="tp-field"><span className="tp-field-label">District</span><span className="tp-field-value">{val(form.district)}</span></div>
          <div className="tp-field"><span className="tp-field-label">City / Town</span><span className="tp-field-value">{val(form.city_town)}</span></div>
          <div className="tp-field"><span className="tp-field-label">Pin Code</span><span className="tp-field-value">{val(form.pin_code)}</span></div>
        </div>
      </div>

      {/* ===== EDUCATIONAL QUALIFICATIONS ===== */}
      <div className="tp-section">
        <h2>Educational Qualifications</h2>
        <div className="tp-field-grid">
          <div className="tp-field"><span className="tp-field-label">Highest Degree</span><span className="tp-field-value">{val(profile.highest_degree)}</span></div>
          <div className="tp-field"><span className="tp-field-label">Field of Study</span><span className="tp-field-value">{val(form.field_of_study)}</span></div>
          <div className="tp-field"><span className="tp-field-label">Year of Completion</span><span className="tp-field-value">{val(form.year_of_completion)}</span></div>
          <div className="tp-field">
            <span className="tp-field-label">Teaching Certifications</span>
            <span className="tp-field-value">
              {form.teaching_certifications?.length ? form.teaching_certifications.join(", ") : "—"}
            </span>
          </div>
          <div className="tp-field">
            <span className="tp-field-label">Qualification Certificate</span>
            <span className="tp-field-value">
              {form.qualification_certificate
                ? <a href={form.qualification_certificate} target="_blank" rel="noreferrer">View file</a>
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* ===== TEACHING EXPERIENCE ===== */}
      <div className="tp-section">
        <h2>Teaching Experience</h2>
        <div className="tp-field-grid">
          <div className="tp-field"><span className="tp-field-label">Experience Range</span><span className="tp-field-value">{val(profile.experience_range)}</span></div>
          <div className="tp-field"><span className="tp-field-label">Employment Status</span><span className="tp-field-value">{val(profile.employment_status)}</span></div>
          <div className="tp-field"><span className="tp-field-label">Currently Employed</span><span className="tp-field-value">{form.currently_employed ? "Yes" : "No"}</span></div>
          <div className="tp-field"><span className="tp-field-label">Current Institution</span><span className="tp-field-value">{val(form.current_institution)}</span></div>
          <div className="tp-field"><span className="tp-field-label">Current Position</span><span className="tp-field-value">{val(form.current_position)}</span></div>
        </div>
      </div>

      {/* ===== COURSES & SUBJECTS ===== */}
      <div className="tp-two-col">
        <div className="tp-section">
          <h2>Active Courses</h2>
          {profile.active_courses?.length > 0 ? (
            <div className="tp-list">
              {profile.active_courses.map((course, i) => (
                <div key={i} className="tp-list-item">
                  <span className="tp-list-num">{i + 1})</span>
                  <div>
                    <strong>{course.title}</strong>
                    <ul className="tp-sub-list">
                      {course.subjects.map((s, j) => (
                        <li key={j}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="tp-empty">No active courses assigned.</p>
          )}
        </div>

        <div className="tp-section">
          <h2>Subjects</h2>
          {profile.course_applications?.length > 0 ? (
            <div className="tp-list">
              {profile.course_applications.map((ca, i) => (
                <div key={i} className="tp-list-item">
                  <span className="tp-list-num">{i + 1})</span>
                  <div>
                    <strong>{ca.subject} ({ca.boards?.join(", ")})</strong>
                    <ul className="tp-sub-list">
                      {ca.classes?.map((c, j) => (
                        <li key={j}>Class {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="tp-empty">No subjects applied for.</p>
          )}
        </div>
      </div>

      {/* ===== SKILL APPLICATIONS ===== */}
      {profile.skill_applications?.length > 0 && (
        <div className="tp-section">
          <h2>Specialized Skills</h2>
          <div className="tp-skills-grid">
            {profile.skill_applications.map((sk, i) => (
              <div key={i} className="tp-skill-card">
                <h4>{sk.skill_name}</h4>
                <p>{sk.skill_description}</p>
                <span className="tp-tag employment">{sk.skill_related_subject}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
