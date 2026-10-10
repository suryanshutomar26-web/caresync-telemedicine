import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SymptomInput from './pages/SymptomInput';
import DoctorList from './pages/DoctorList';
import BookAppointment from './pages/BookAppointment';
import AppointmentDetail from './pages/AppointmentDetail';
import MyAppointments from './pages/MyAppointments';
import DoctorDashboard from './pages/DoctorDashboard';
import WritePrescription from './pages/WritePrescription';
import Prescriptions from './pages/Prescriptions';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Admin from './pages/Admin';

function Protected({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/symptoms" element={<Protected roles={['patient']}><SymptomInput /></Protected>} />
        <Route path="/doctors" element={<Protected roles={['patient']}><DoctorList /></Protected>} />
        <Route path="/book" element={<Protected roles={['patient']}><BookAppointment /></Protected>} />
        <Route path="/appointments" element={<Protected roles={['patient']}><MyAppointments /></Protected>} />
        <Route path="/appointments/:id" element={<Protected><AppointmentDetail /></Protected>} />
        <Route path="/prescriptions" element={<Protected roles={['patient']}><Prescriptions /></Protected>} />
        <Route path="/cart" element={<Protected roles={['patient']}><Cart /></Protected>} />
        <Route path="/checkout" element={<Protected roles={['patient']}><Checkout /></Protected>} />
        <Route path="/orders" element={<Protected roles={['patient']}><Orders /></Protected>} />

        <Route path="/doctor-dashboard" element={<Protected roles={['doctor']}><DoctorDashboard /></Protected>} />
        <Route path="/doctor-dashboard/prescribe/:appointmentId" element={<Protected roles={['doctor']}><WritePrescription /></Protected>} />

        <Route path="/admin" element={<Protected roles={['admin']}><Admin /></Protected>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
