import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cancelBooking, errorMessage, getMyBookings } from '../services/api.js';
import { isoDate, money } from '../utils.js';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = () => getMyBookings().then(setBookings).catch((err) => setError(errorMessage(err)));

  useEffect(() => { load(); }, []);

  const handleCancel = async (b) => {
    if (!window.confirm(`Cancel your booking at ${b.hotelName}?`)) return;
    setError('');
    setMessage('');
    try {
      await cancelBooking(b.id);
      setMessage(`Booking #${b.id} was cancelled.`);
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const today = isoDate(0);

  return (
    <div className="container pb-5">
      <h2 className="page-title">My bookings</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {bookings.length === 0 && !error ? (
        <p className="text-muted">You have no bookings yet. <Link to="/hotels">Find a hotel</Link></p>
      ) : (
        <div className="table-wrap table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr><th>#</th><th>Hotel</th><th>Room</th><th>Dates</th><th>Guests</th><th>Total</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.hotelName}<div className="small text-muted">{b.city}</div></td>
                  <td>{b.roomType}</td>
                  <td>{b.checkIn} to {b.checkOut}</td>
                  <td>{b.guests}</td>
                  <td>{money(b.totalPrice)}</td>
                  <td>
                    <span className={`badge ${b.status === 'CONFIRMED' ? 'text-bg-success' : 'text-bg-secondary'}`}>{b.status}</span>
                  </td>
                  <td className="text-end">
                    {b.status === 'CONFIRMED' && b.checkIn > today && (
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancel(b)}>Cancel booking</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
