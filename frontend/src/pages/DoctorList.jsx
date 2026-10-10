import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function DoctorList() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState('video');

  if (!state) {
    return (
      <div className="container">
        <p>No symptom data found. Please start a new consultation.</p>
        <button className="btn" onClick={() => navigate('/symptoms')}>
          Go to Symptom Input
        </button>
      </div>
    );
  }

  const { analysis, matchedDoctors, symptoms, location } = state;

  function selectDoctor(doctor) {
    navigate('/book', {
      state: { doctor, mode, symptoms, analysis, patientLocation: location },
    });
  }

  return (
    <div className="container">
      <div className="card">
        <h3>AI Assessment</h3>
        <p>
          Based on your symptoms, we suggest: <strong>{analysis.predictedSpecialization}</strong>{' '}
          <span className={`badge ${analysis.urgency}`}>{analysis.urgency} urgency</span>
        </p>
        {analysis.matchedKeywords?.length > 0 && (
          <p className="text-muted">
            Matched terms: {analysis.matchedKeywords.join(', ')}
          </p>
        )}
        {analysis.urgency === 'high' && (
          <p style={{ color: 'var(--danger)', fontWeight: 700 }}>
            ⚠ Your symptoms may need urgent attention. Please consider visiting an emergency
            room if symptoms worsen.
          </p>
        )}
      </div>

      <div className="flex-between" style={{ marginBottom: 16 }}>
        <h3>Available Doctors ({matchedDoctors.length})</h3>
        <div>
          <label style={{ display: 'inline', marginRight: 8 }}>Consultation type:</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)} style={{ width: 180, display: 'inline-block', marginBottom: 0 }}>
            <option value="video">Video Consultation</option>
            <option value="in-person">In-Person Visit</option>
          </select>
        </div>
      </div>

      {matchedDoctors.length === 0 && (
        <p className="text-muted">No doctors found nearby. Try widening your search or check back later.</p>
      )}

      <div className="doctor-grid">
        {matchedDoctors.map((doc) => (
          <div className="card" key={doc._id}>
            <h4>{doc.name}</h4>
            <p className="text-muted">{doc.specialization}</p>
            {doc.distanceKm != null && (
              <p className="text-muted">📍 {doc.distanceKm} km away</p>
            )}
            <p>{doc.address}</p>
            <p><strong>₹{doc.fee}</strong> per consultation</p>
            <button className="btn" onClick={() => selectDoctor(doc)} style={{ width: '100%' }}>
              Book {mode === 'video' ? 'Video Call' : 'In-Person Visit'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
