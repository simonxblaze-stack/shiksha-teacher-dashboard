import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import "../styles/dashboard.css";

import LiveSessionCard from "../components/LiveSessionCard";
import CalendarWidget from "../components/CalendarWidget";
import AssignmentItem from "../components/AssignmentItem";
import QuizItem from "../components/QuizItem";
import ActivityItem from "../components/ActivityItem";

import api from "../api/apiClient";

export default function TeacherDashboard() {
  const outletContext = useOutletContext();
  const active = outletContext?.active || "sessions";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [assignFilter, setAssignFilter] = useState(null);
  const [quizFilter, setQuizFilter] = useState(null);
  const [activityFilter, setActivityFilter] = useState("all");

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard/");
      setData(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <div className="dashboard">Loading...</div>;

  const sessions = data?.sessions || [];
  const assignments = data?.assignments || [];
  const quizzes = data?.quizzes || [];
  const notifications = data?.notifications || [];

  const toggleFilter = (current, value, setter) => {
    setter(current === value ? null : value);
  };

  const filteredAssignments = assignFilter
    ? assignments.filter((a) =>
        assignFilter === "overdue"
          ? new Date(a.due) < new Date()
          : new Date(a.due) >= new Date()
      )
    : assignments;

  const filteredQuizzes = quizFilter
    ? quizzes.filter((q) =>
        quizFilter === "overdue"
          ? new Date(q.due) < new Date()
          : new Date(q.due) >= new Date()
      )
    : quizzes;

  const filteredActivities = notifications.filter(
    (item) => activityFilter === "all" || item.type === activityFilter
  );

  // ---------------- MOBILE ----------------
  if (isMobile) {
    return (
      <div className="dashboard">

        {active === "sessions" && (
          <div className="dash-card">
            <h4>Upcoming Live Sessions</h4>
            {sessions.map((s) => (
              <LiveSessionCard
                key={s.id}
                subject={s.subject}
                topic={s.topic}
                startsIn=""
                timing={new Date(s.dateTime).toLocaleString()}
              />
            ))}
          </div>
        )}

        {active === "assignments" && (
          <div className="dash-card">
            <h4>Assignments</h4>
            {filteredAssignments.map((a) => (
              <AssignmentItem
                key={a.id}
                id={a.title}
                subject={a.teacher}
                dueDate={new Date(a.due).toLocaleDateString()}
              />
            ))}
          </div>
        )}

        {active === "quizzes" && (
          <div className="dash-card">
            <h4>Quiz</h4>
            {filteredQuizzes.map((q) => (
              <QuizItem
                key={q.id}
                id={q.title}
                subject={q.teacher}
                dueDate={new Date(q.due).toLocaleDateString()}
              />
            ))}
          </div>
        )}

        {active === "notifications" && (
          <div className="dash-card">
            <h4>Notifications</h4>
            {filteredActivities.map((item) => (
              <ActivityItem
                key={item.id}
                date={new Date(item.created_at).toLocaleDateString()}
                label={item.type}
                lines={[item.title]}
              />
            ))}
          </div>
        )}

        {active === "calendar" && <CalendarWidget />}
      </div>
    );
  }

  // ---------------- DESKTOP ----------------
  return (
    <div className="dashboard">

      <div className="dash-top">
        <div className="dash-live-section">
          <h3>Upcoming Live Sessions</h3>
          <div className="dash-live-row">
            {sessions.map((s) => (
              <LiveSessionCard
                key={s.id}
                subject={s.subject}
                topic={s.topic}
                startsIn=""
                timing={new Date(s.dateTime).toLocaleString()}
              />
            ))}
          </div>
        </div>

        <CalendarWidget />
      </div>

      <div className="dash-bottom">

        <div className="dash-card">
          <h4>Assignments</h4>
          {filteredAssignments.map((a) => (
            <AssignmentItem
              key={a.id}
              id={a.title}
              subject={a.teacher}
              dueDate={new Date(a.due).toLocaleDateString()}
            />
          ))}
        </div>

        <div className="dash-card">
          <h4>Quiz</h4>
          {filteredQuizzes.map((q) => (
            <QuizItem
              key={q.id}
              id={q.title}
              subject={q.teacher}
              dueDate={new Date(q.due).toLocaleDateString()}
            />
          ))}
        </div>

        <div className="dash-card">
          <h4>Notifications</h4>
          {filteredActivities.map((item) => (
            <ActivityItem
              key={item.id}
              date={new Date(item.created_at).toLocaleDateString()}
              label={item.type}
              lines={[item.title]}
            />
          ))}
        </div>

      </div>
    </div>
  );
}