import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { errorMessage, getAllBookings, getDashboard } from '../../services/api.js';
import { money } from '../../utils.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard().then(setStats).catch((err) => setError(errorMessage(err)));
    getAllBookings().then(setBookings).catch((err) => setError(errorMessage(err)));
  }, []);

  const cards = stats && [
    ['Users', stats.totalUsers],
    ['Hotels', stats.totalHotels],
    ['Travel packages', stats.totalPackages],
    ['Total bookings', stats.totalBookings],
    ['Confirmed', stats.confirmedBookings],
    ['Cancelled', stats.cancelledBookings],
    ['Revenue', money(stats.totalRevenue)],
  ];

  return (
    <div className="container pb-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center page-title">
        <h2 className="m-0">Admin dashboard</h2>
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" to="/admin/hotels">Manage hotels</Link>
          <Link className="btn btn-outline-primary" to="/admin/packages">Manage packages</Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        {cards && cards.map(([label, value]) => (
          <div className="col-6 col-md-3" key={label}>
            <div className="stat-card">
              <div className="text-muted small">{label}</div>
              <div className="stat-number">{value}</div>
            </div>
          </div>
        ))}
      </div>

      <h4 className="mb-3">All bookings</h4>
      <div className="table-wrap table-responsive">
        <table className="table align-middle mb-0">
          <thead>
            <tr><th>#</th><th>Guest</th><th>Hotel</th><th>Room</th><th>Dates</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.userName}<div className="small text-muted">{b.userEmail}</div></td>
                <td>{b.hotelName}</td>
                <td>{b.roomType}</td>
                <td>{b.checkIn} to {b.checkOut}</td>
                <td>{money(b.totalPrice)}</td>
                <td><span className={`badge ${b.status === 'CONFIRMED' ? 'text-bg-success' : 'text-bg-secondary'}`}>{b.status}</span></td>
              </tr>
            ))}
            {bookings.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-4">No bookings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
