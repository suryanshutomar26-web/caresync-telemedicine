import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', padding: 48 }}>
        <h1>AI-Assisted Telemedicine</h1>
        <p className="text-muted">
          Describe your symptoms, get matched with the right doctor nearby, consult via video
          or in-person, and get prescribed medicines delivered — all in one place.
        </p>
        {user?.role === 'patient' && (
          <Link className="btn" to="/symptoms">Start a Consultation</Link>
        )}
        {!user && (
          <Link className="btn" to="/register">Get Started</Link>
        )}
      </div>
    </div>
  );
}
