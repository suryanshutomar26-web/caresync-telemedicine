import { useEffect, useState } from 'react';
import api from '../api/axios';

const STEPS = ['placed', 'packed', 'out-for-delivery', 'delivered', 'cancelled'];

export default function Admin() {
  const [orders, setOrders] = useState([]);

  function load() {
    api.get('/orders').then((res) => setOrders(res.data));
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    await api.put(`/orders/${id}/status`, { status });
    load();
  }

  return (
    <div className="container">
      <h2>Admin — Pharmacy Order Management</h2>
      {orders.map((o) => (
        <div className="card flex-between" key={o._id}>
          <div>
            <h4>Order #{o._id.slice(-6).toUpperCase()}</h4>
            <p className="text-muted">₹{o.totalAmount} • {o.items.length} item(s)</p>
            <p className="text-muted">{o.deliveryAddress}</p>
          </div>
          <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} style={{ width: 180, marginBottom: 0 }}>
            {STEPS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}
