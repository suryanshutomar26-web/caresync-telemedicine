import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function SymptomInput() {
  const [symptoms, setSymptoms] = useState('');
  const [location, setLocation] = useState(null);
  const [locStatus, setLocStatus] = useState('idle'); // idle | fetching | done | denied
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function fetchLocation() {
    setLocStatus('fetching');
    if (!navigator.geolocation) {
      setLocStatus('denied');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus('done');
      },
      () => setLocStatus('denied'),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/ai/analyze-symptoms', {
        symptoms,
        lat: location?.lat,
        lng: location?.lng,
      });
      // Pass result to DoctorList via navigation state
      navigate('/doctors', {
        state: { analysis: data.analysis, matchedDoctors: data.matchedDoctors, symptoms, location },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Tell us what's wrong</h2>
        <p className="text-muted">
          Describe your symptoms in your own words — our AI will suggest the right kind of
          doctor and match you with nearby specialists.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Your symptoms</label>
          <textarea
            rows={5}
            placeholder="e.g. I've had a mild fever, sore throat, and headache since yesterday..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
          />

          <div className="flex-between" style={{ marginBottom: 16 }}>
            <div>
              {locStatus === 'idle' && (
                <button type="button" className="btn secondary" onClick={fetchLocation}>
                  📍 Use my current location
                </button>
              )}
              {locStatus === 'fetching' && <span className="text-muted">Fetching location...</span>}
              {locStatus === 'done' && (
                <span style={{ color: 'var(--success)' }}>✓ Location captured</span>
              )}
              {locStatus === 'denied' && (
                <span className="text-muted">
                  Location unavailable — we'll show doctors without distance filtering.
                </span>
              )}
            </div>
          </div>

          {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Analyzing symptoms...' : 'Find the right doctor'}
          </button>
        </form>
      </div>
    </div>
  );
}
