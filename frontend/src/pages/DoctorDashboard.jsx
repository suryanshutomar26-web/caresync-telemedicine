import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/appointments').then((res) => {
      setAppointments(res.data);
      setLoading(false);
    });
  }, []);

  const pending = appointments.filter((a) => a.status !== 'completed' && a.status !== 'cancelled');
  const completed = appointments.filter((a) => a.status === 'completed');

  return (
    <div className="container">
      <h2>Doctor Dashboard</h2>

      <h3>Upcoming / Active Appointments ({pending.length})</h3>
      {loading && <p>Loading...</p>}
      {!loading && pending.length === 0 && <p className="text-muted">No pending appointments.</p>}
      {pending.map((a) => (
        <div className="card flex-between" key={a._id}>
          <div>
            <h4>{a.patient?.name}</h4>
            <p className="text-muted">{a.mode === 'video' ? '📹 Video' : '🏥 In-Person'} • {a.slot}</p>
            <p>Symptoms: {a.symptoms}</p>
            <span className={`badge ${a.urgency}`}>{a.urgency} urgency</span>
          </div>
          <Link to={`/appointments/${a._id}`} className="btn">Open</Link>
        </div>
      ))}

      <h3 style={{ marginTop: 32 }}>Completed ({completed.length})</h3>
      {completed.map((a) => (
        <div className="card flex-between" key={a._id}>
          <div>
            <h4>{a.patient?.name}</h4>
            <p className="text-muted">{a.slot}</p>
          </div>
          <Link to={`/appointments/${a._id}`} className="btn secondary">View</Link>
        </div>
      ))}
    </div>
  );
}
