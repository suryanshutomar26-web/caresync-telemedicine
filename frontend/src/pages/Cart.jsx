import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  function updateQuantity(index, qty) {
    const updated = [...cart];
    updated[index].quantity = Math.max(1, qty);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  }

  function removeItem(index) {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {cart.length === 0 && <p className="text-muted">Your cart is empty. Add medicines from a prescription.</p>}
      {cart.map((item, i) => (
        <div className="card flex-between" key={i}>
          <div>
            <h4>{item.name}</h4>
            <p className="text-muted">{item.dosage}</p>
            <p>₹{item.price} each</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(i, Number(e.target.value))}
              style={{ width: 70, marginBottom: 0 }}
            />
            <button className="btn danger" onClick={() => removeItem(i)}>Remove</button>
          </div>
        </div>
      ))}
      {cart.length > 0 && (
        <div className="card flex-between">
          <h3>Total: ₹{total}</h3>
          <button className="btn" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
