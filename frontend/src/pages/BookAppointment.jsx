import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/axios';
import MapView from '../components/MapView';

const SLOTS = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

export default function BookAppointment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [slot, setSlot] = useState(SLOTS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!state) {
    return (
      <div className="container">
        <p>No doctor selected. Please start again.</p>
        <button className="btn" onClick={() => navigate('/symptoms')}>Start Over</button>
      </div>
    );
  }

  const { doctor, mode, symptoms, analysis, patientLocation } = state;

  async function confirmBooking() {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/appointments', {
        doctor: doctor._id,
        mode,
        symptoms,
        predictedSpecialization: analysis.predictedSpecialization,
        urgency: analysis.urgency,
        slot,
      });
      navigate(`/appointments/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please make sure you are logged in as a patient.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Confirm your appointment</h2>
        <p><strong>Doctor:</strong> {doctor.name} ({doctor.specialization})</p>
        <p><strong>Mode:</strong> {mode === 'video' ? 'Video Consultation' : 'In-Person Visit'}</p>
        <p><strong>Fee:</strong> ₹{doctor.fee}</p>

        {mode === 'in-person' && doctor.location && (
          <>
            <p><strong>Clinic address:</strong> {doctor.address}</p>
            <MapView patient={patientLocation} doctor={{ ...doctor.location, name: doctor.name }} />
          </>
        )}

        <label>Choose a time slot</label>
        <select value={slot} onChange={(e) => setSlot(e.target.value)}>
          {SLOTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

        <button className="btn" onClick={confirmBooking} disabled={loading}>
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}
