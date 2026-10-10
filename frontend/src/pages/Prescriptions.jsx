import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/prescriptions').then((res) => {
      setPrescriptions(res.data);
      setLoading(false);
    });
  }, []);

  function addAllToCart(prescription) {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const newItems = prescription.medicines.map((m) => ({
      name: m.name,
      dosage: m.dosage,
      price: m.price,
      quantity: 1,
    }));
    localStorage.setItem('cart', JSON.stringify([...existingCart, ...newItems]));
    navigate('/cart');
  }

  return (
    <div className="container">
      <h2>My Prescriptions</h2>
      {loading && <p>Loading...</p>}
      {!loading && prescriptions.length === 0 && (
        <p className="text-muted">No prescriptions yet.</p>
      )}
      {prescriptions.map((p) => (
        <div className="card" key={p._id}>
          <h4>Dr. {p.doctor?.name} — {p.doctor?.specialization}</h4>
          <p className="text-muted">{new Date(p.createdAt).toLocaleDateString()}</p>
          {p.notes && <p><em>{p.notes}</em></p>}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th>Medicine</th><th>Dosage</th><th>Duration</th><th>Price</th>
              </tr>
            </thead>
            <tbody>
              {p.medicines.map((m, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td>{m.name}</td><td>{m.dosage}</td><td>{m.duration || '-'}</td><td>₹{m.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn" onClick={() => addAllToCart(p)}>Add All to Cart</button>
        </div>
      ))}
    </div>
  );
}
