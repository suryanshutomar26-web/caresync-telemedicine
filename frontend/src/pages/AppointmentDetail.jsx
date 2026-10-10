import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';

export default function AppointmentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/appointments/${id}`).then((res) => {
      setAppointment(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="container">Loading...</div>;
  if (!appointment) return <div className="container">Appointment not found.</div>;

  const isVideo = appointment.mode === 'video';
  // meet.jit.si is a free public Jitsi server - no API key or signaling server needed.
  const jitsiUrl = `https://meet.jit.si/${appointment.videoRoom}`;

  return (
    <div className="container">
      <div className="card">
        <h2>Appointment with {appointment.doctor?.name}</h2>
        <p className="text-muted">{appointment.doctor?.specialization} • {appointment.slot}</p>
        <p><strong>Status:</strong> <span className={`badge ${appointment.urgency}`}>{appointment.status}</span></p>
        <p><strong>Symptoms reported:</strong> {appointment.symptoms}</p>
      </div>

      {isVideo ? (
        <div className="card">
          <h3>Video Consultation</h3>
          <p className="text-muted">Join when your doctor is ready. This uses a free, encrypted Jitsi Meet room.</p>
          <iframe
            className="video-frame"
            src={jitsiUrl}
            allow="camera; microphone; fullscreen; display-capture"
          ></iframe>
        </div>
      ) : (
        <div className="card">
          <h3>In-Person Visit</h3>
          <p><strong>Clinic:</strong> {appointment.doctor?.address}</p>
          {appointment.doctor?.location && (
            <MapView doctor={{ ...appointment.doctor.location, name: appointment.doctor.name }} />
          )}
        </div>
      )}

      {user?.role === 'doctor' && appointment.status !== 'completed' && (
        <div className="card">
          <Link to={`/doctor-dashboard/prescribe/${appointment._id}`} className="btn">
            Write Prescription & Complete Consultation
          </Link>
        </div>
      )}

      {user?.role === 'patient' && appointment.status === 'completed' && (
        <div className="card">
          <Link to="/prescriptions" className="btn">View Prescription</Link>
        </div>
      )}
    </div>
  );
}
