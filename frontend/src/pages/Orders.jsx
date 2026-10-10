import { useEffect, useState } from 'react';
import api from '../api/axios';

const STEPS = ['placed', 'packed', 'out-for-delivery', 'delivered'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container">
      <h2>My Orders</h2>
      {loading && <p>Loading...</p>}
      {!loading && orders.length === 0 && <p className="text-muted">No orders yet.</p>}
      {orders.map((o) => {
        const currentIndex = STEPS.indexOf(o.status);
        return (
          <div className="card" key={o._id}>
            <div className="flex-between">
              <h4>Order #{o._id.slice(-6).toUpperCase()}</h4>
              <strong>₹{o.totalAmount}</strong>
            </div>
            <p className="text-muted">{new Date(o.createdAt).toLocaleString()}</p>
            <div className="status-tracker">
              {STEPS.map((step, i) => (
                <div className={`step ${i <= currentIndex ? 'done' : ''}`} key={step}>
                  {step.replace(/-/g, ' ')}
                </div>
              ))}
            </div>
            <ul>
              {o.items.map((item, i) => (
                <li key={i}>{item.name} x{item.quantity} — ₹{item.price * item.quantity}</li>
              ))}
            </ul>
            <p className="text-muted">Delivering to: {o.deliveryAddress}</p>
          </div>
        );
      })}
    </div>
  );
}
