import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="navbar">
      <Link to="/" className="brand">🩺 MediConnect</Link>
      <nav>
        {user ? (
          <>
            {user.role === 'patient' && (
              <>
                <Link to="/symptoms">New Consultation</Link>
                <Link to="/appointments">My Appointments</Link>
                <Link to="/prescriptions">Prescriptions</Link>
                <Link to="/cart">Cart</Link>
                <Link to="/orders">Orders</Link>
              </>
            )}
            {user.role === 'doctor' && <Link to="/doctor-dashboard">Dashboard</Link>}
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <span className="text-muted">Hi, {user.name}</span>
            <button className="btn secondary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn">
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}
