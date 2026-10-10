import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Checkout() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function placeOrder(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/orders', { items: cart, deliveryAddress: address });
      localStorage.removeItem('cart');
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Checkout</h2>
        <p><strong>{cart.length}</strong> item(s) — Total: <strong>₹{total}</strong></p>
        <form onSubmit={placeOrder}>
          <label>Delivery Address</label>
          <textarea rows={3} value={address} onChange={(e) => setAddress(e.target.value)} required />
          {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
          <button className="btn" type="submit" disabled={loading || cart.length === 0}>
            {loading ? 'Placing order...' : 'Place Order (Cash on Delivery)'}
          </button>
        </form>
      </div>
    </div>
  );
}
