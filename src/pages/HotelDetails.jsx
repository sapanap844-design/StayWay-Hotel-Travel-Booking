import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createBooking, errorMessage, getAvailability, getHotel } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { isoDate, money, nightsBetween } from '../utils.js';

export default function HotelDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);       // [{ room, availableRooms }]
  const [checkIn, setCheckIn] = useState(isoDate(1));
  const [checkOut, setCheckOut] = useState(isoDate(2));
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadAvailability = async () => {
    setError('');
    try {
      setRooms(await getAvailability(id, checkIn, checkOut));
    } catch (err) {
      setRooms([]);
      setError(errorMessage(err));
    }
  };

  useEffect(() => {
    getHotel(id).then(setHotel).catch((err) => setError(errorMessage(err)));
    loadAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBook = async (room) => {
    if (!user) {
      navigate('/login', { state: { from: `/hotels/${id}` } });
      return;
    }
    setError('');
    setSuccess('');
    try {
      const booking = await createBooking({ roomId: room.id, checkIn, checkOut, guests: Number(guests) });
      setSuccess(`Booking #${booking.id} confirmed. Total ${money(booking.totalPrice)}.`);
      loadAvailability();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  if (!hotel) {
    return <div className="container py-5">{error ? <div className="alert alert-danger">{error}</div> : 'Loading...'}</div>;
  }

  const nights = nightsBetween(checkIn, checkOut);

  return (
    <div className="container pb-5">
      <div className="row g-4 mt-2">
        <div className="col-lg-6">
          <div className="card-img-box rounded" style={{ height: 320 }}>
            {hotel.imageUrl ? <img src={hotel.imageUrl} alt={hotel.name} /> : <div className="img-placeholder">{hotel.name.charAt(0)}</div>}
          </div>
        </div>
        <div className="col-lg-6">
          <h2>{hotel.name}</h2>
          <p className="text-muted mb-1">{hotel.city}{hotel.address ? ` - ${hotel.address}` : ''}</p>
          {hotel.rating != null && <span className="badge rating-badge mb-3">Rating {hotel.rating}</span>}
          <p>{hotel.description}</p>
        </div>
      </div>

      <h3 className="page-title">Rooms and availability</h3>

      <div className="row g-2 align-items-end mb-3">
        <div className="col-6 col-md-3">
          <label className="form-label" htmlFor="ci">Check-in</label>
          <input id="ci" type="date" className="form-control" min={isoDate(0)} value={checkIn}
                 onChange={(e) => setCheckIn(e.target.value)} />
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label" htmlFor="co">Check-out</label>
          <input id="co" type="date" className="form-control" min={checkIn} value={checkOut}
                 onChange={(e) => setCheckOut(e.target.value)} />
        </div>
        <div className="col-6 col-md-2">
          <label className="form-label" htmlFor="gs">Guests</label>
          <input id="gs" type="number" min="1" className="form-control" value={guests}
                 onChange={(e) => setGuests(e.target.value)} />
        </div>
        <div className="col-6 col-md-4 d-grid">
          <button className="btn btn-primary" onClick={loadAvailability}>Check availability</button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && (
        <div className="alert alert-success">
          {success} <Link to="/my-bookings">View my bookings</Link>
        </div>
      )}

      <div className="table-wrap table-responsive">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th>Room type</th>
              <th>Max guests</th>
              <th>Price per night</th>
              <th>Total ({nights} {nights === 1 ? 'night' : 'nights'})</th>
              <th>Available</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(({ room, availableRooms }) => (
              <tr key={room.id}>
                <td>{room.roomType}</td>
                <td>{room.capacity}</td>
                <td>{money(room.pricePerNight)}</td>
                <td className="price-text">{money(room.pricePerNight * nights)}</td>
                <td>
                  {availableRooms > 0
                    ? <span className="badge text-bg-success">{availableRooms} left</span>
                    : <span className="badge text-bg-secondary">Sold out</span>}
                </td>
                <td className="text-end">
                  <button className="btn btn-brass btn-sm" disabled={availableRooms < 1} onClick={() => handleBook(room)}>
                    Book now
                  </button>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr><td colSpan="6" className="text-center text-muted py-4">No rooms to show for these dates.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
