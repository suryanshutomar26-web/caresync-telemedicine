import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/appointments').then((res) => {
      setAppointments(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container">
      <h2>My Appointments</h2>
      {loading && <p>Loading...</p>}
      {!loading && appointments.length === 0 && (
        <p className="text-muted">No appointments yet. <Link to="/symptoms">Start a consultation</Link>.</p>
      )}
      {appointments.map((a) => (
        <div className="card flex-between" key={a._id}>
          <div>
            <h4>{a.doctor?.name} — {a.doctor?.specialization}</h4>
            <p className="text-muted">{a.mode === 'video' ? '📹 Video' : '🏥 In-Person'} • {a.slot}</p>
            <span className={`badge ${a.urgency}`}>{a.status}</span>
          </div>
          <Link to={`/appointments/${a._id}`} className="btn secondary">View</Link>
        </div>
      ))}
    </div>
  );
}
