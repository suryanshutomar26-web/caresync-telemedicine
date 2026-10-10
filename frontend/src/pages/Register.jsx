import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    phone: '',
    specialization: '',
    fee: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form };

      // For doctors, attach a location. In production, geocode `address` server-side
      // or use a places autocomplete widget. For demo, we use browser geolocation
      // as a stand-in so the doctor's clinic appears on the map.
      if (form.role === 'doctor') {
        payload.fee = Number(form.fee) || 0;
        await new Promise((resolve) => {
          if (!navigator.geolocation) return resolve();
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              payload.location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
              resolve();
            },
            () => resolve(),
            { timeout: 5000 }
          );
        });
      }

      const user = await register(payload);
      if (user.role === 'doctor') navigate('/doctor-dashboard');
      else navigate('/symptoms');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container center-form">
      <div className="card">
        <h2>Create your account</h2>
        {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>I am a</label>
          <select value={form.role} onChange={update('role')}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>

          <label>Full Name</label>
          <input value={form.name} onChange={update('name')} required />

          <label>Email</label>
          <input type="email" value={form.email} onChange={update('email')} required />

          <label>Password</label>
          <input type="password" value={form.password} onChange={update('password')} required />

          <label>Phone</label>
          <input value={form.phone} onChange={update('phone')} />

          {form.role === 'doctor' && (
            <>
              <label>Specialization</label>
              <select value={form.specialization} onChange={update('specialization')} required>
                <option value="">Select specialization</option>
                {[
                  'General Physician',
                  'Cardiologist',
                  'Dermatologist',
                  'Orthopedic',
                  'Gastroenterologist',
                  'Ophthalmologist',
                  'ENT',
                  'Psychiatrist',
                  'Dentist',
                  'Pediatrician',
                  'Gynecologist',
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <label>Consultation Fee (₹)</label>
              <input type="number" value={form.fee} onChange={update('fee')} required />

              <label>Clinic Address</label>
              <input value={form.address} onChange={update('address')} required />
              <p className="text-muted" style={{ marginTop: -8 }}>
                We'll use your current location as your clinic's map pin for this demo.
              </p>
            </>
          )}

          <button className="btn" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-muted" style={{ marginTop: 12 }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
