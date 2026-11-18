import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Hotels from './pages/Hotels.jsx';
import HotelDetails from './pages/HotelDetails.jsx';
import Packages from './pages/Packages.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import MyBookings from './pages/MyBookings.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageHotels from './pages/admin/ManageHotels.jsx';
import ManagePackages from './pages/admin/ManagePackages.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelDetails />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/hotels" element={<ProtectedRoute adminOnly><ManageHotels /></ProtectedRoute>} />
        <Route path="/admin/packages" element={<ProtectedRoute adminOnly><ManagePackages /></ProtectedRoute>} />

        <Route path="*" element={<div className="container py-5"><h2>Page not found</h2></div>} />
      </Routes>
    </>
  );
}
