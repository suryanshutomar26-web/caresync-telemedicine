import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function WritePrescription() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [notes, setNotes] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '', price: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/appointments/${appointmentId}`).then((res) => setAppointment(res.data));
  }, [appointmentId]);

  function updateMedicine(index, field, value) {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  }

  function addMedicine() {
    setMedicines([...medicines, { name: '', dosage: '', duration: '', price: '' }]);
  }

  function removeMedicine(index) {
    setMedicines(medicines.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/prescriptions', {
        appointment: appointmentId,
        patient: appointment.patient._id,
        notes,
        medicines: medicines.map((m) => ({ ...m, price: Number(m.price) })),
      });
      navigate(`/appointments/${appointmentId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save prescription');
    } finally {
      setLoading(false);
    }
  }

  if (!appointment) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="card">
        <h2>Write Prescription for {appointment.patient?.name}</h2>
        <p className="text-muted">Symptoms: {appointment.symptoms}</p>

        <form onSubmit={handleSubmit}>
          <label>Doctor's Notes</label>
          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />

          <label>Medicines</label>
          {medicines.map((m, i) => (
            <div key={i} className="card" style={{ background: '#f8fafc' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input placeholder="Medicine name" value={m.name} onChange={(e) => updateMedicine(i, 'name', e.target.value)} required />
                <input placeholder="Dosage (e.g. 500mg twice daily)" value={m.dosage} onChange={(e) => updateMedicine(i, 'dosage', e.target.value)} required />
                <input placeholder="Duration (e.g. 5 days)" value={m.duration} onChange={(e) => updateMedicine(i, 'duration', e.target.value)} />
                <input type="number" placeholder="Price (₹)" value={m.price} onChange={(e) => updateMedicine(i, 'price', e.target.value)} required />
              </div>
              {medicines.length > 1 && (
                <button type="button" className="btn secondary" onClick={() => removeMedicine(i)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn secondary" onClick={addMedicine} style={{ marginBottom: 16 }}>
            + Add another medicine
          </button>

          {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

          <div>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Prescription & Mark Completed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
