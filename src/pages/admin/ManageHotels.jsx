import { useEffect, useState } from 'react';
import {
  adminDeleteHotel, adminDeleteRoom, adminSaveHotel, adminSaveRoom,
  errorMessage, getRooms, searchHotels,
} from '../../services/api.js';
import { money } from '../../utils.js';

const emptyHotel = { name: '', city: '', address: '', description: '', imageUrl: '', rating: '' };
const emptyRoom = { roomType: '', pricePerNight: '', capacity: 2, totalRooms: 1 };

export default function ManageHotels() {
  const [hotels, setHotels] = useState([]);
  const [hotelForm, setHotelForm] = useState(emptyHotel);
  const [selected, setSelected] = useState(null);   // hotel whose rooms we are editing
  const [rooms, setRooms] = useState([]);
  const [roomForm, setRoomForm] = useState(emptyRoom);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadHotels = () => searchHotels().then(setHotels).catch((err) => setError(errorMessage(err)));
  const loadRooms = (hotelId) => getRooms(hotelId).then(setRooms).catch((err) => setError(errorMessage(err)));

  useEffect(() => { loadHotels(); }, []);

  const show = (msg) => { setMessage(msg); setError(''); };
  const fail = (err) => { setError(errorMessage(err)); setMessage(''); };

  // ----- hotel form -----
  const saveHotel = async (e) => {
    e.preventDefault();
    try {
      await adminSaveHotel({ ...hotelForm, rating: hotelForm.rating === '' ? null : Number(hotelForm.rating) });
      show(hotelForm.id ? 'Hotel updated.' : 'Hotel added.');
      setHotelForm(emptyHotel);
      loadHotels();
    } catch (err) { fail(err); }
  };

  const removeHotel = async (h) => {
    if (!window.confirm(`Delete ${h.name} and its rooms?`)) return;
    try {
      await adminDeleteHotel(h.id);
      show('Hotel deleted.');
      if (selected?.id === h.id) setSelected(null);
      loadHotels();
    } catch (err) { fail(err); }
  };

  // ----- room form -----
  const openRooms = (h) => {
    setSelected(h);
    setRoomForm(emptyRoom);
    loadRooms(h.id);
  };

  const saveRoom = async (e) => {
    e.preventDefault();
    try {
      await adminSaveRoom(selected.id, {
        ...roomForm,
        pricePerNight: Number(roomForm.pricePerNight),
        capacity: Number(roomForm.capacity),
        totalRooms: Number(roomForm.totalRooms),
      });
      show(roomForm.id ? 'Room updated.' : 'Room added.');
      setRoomForm(emptyRoom);
      loadRooms(selected.id);
    } catch (err) { fail(err); }
  };

  const removeRoom = async (r) => {
    if (!window.confirm(`Delete room type ${r.roomType}?`)) return;
    try {
      await adminDeleteRoom(r.id);
      show('Room deleted.');
      loadRooms(selected.id);
    } catch (err) { fail(err); }
  };

  const hChange = (e) => setHotelForm({ ...hotelForm, [e.target.name]: e.target.value });
  const rChange = (e) => setRoomForm({ ...roomForm, [e.target.name]: e.target.value });

  return (
    <div className="container pb-5">
      <h2 className="page-title">Manage hotels</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="row g-4">
        <div className="col-lg-4">
          <form className="bg-white p-3 rounded shadow-sm" onSubmit={saveHotel}>
            <h5>{hotelForm.id ? 'Edit hotel' : 'Add a hotel'}</h5>
            <input className="form-control mb-2" name="name" placeholder="Hotel name" required value={hotelForm.name} onChange={hChange} />
            <input className="form-control mb-2" name="city" placeholder="City" required value={hotelForm.city} onChange={hChange} />
            <input className="form-control mb-2" name="address" placeholder="Address" value={hotelForm.address || ''} onChange={hChange} />
            <input className="form-control mb-2" name="imageUrl" placeholder="Image URL" value={hotelForm.imageUrl || ''} onChange={hChange} />
            <input className="form-control mb-2" name="rating" type="number" step="0.1" min="0" max="5" placeholder="Rating (0-5)"
                   value={hotelForm.rating ?? ''} onChange={hChange} />
            <textarea className="form-control mb-2" name="description" rows="3" placeholder="Description"
                      value={hotelForm.description || ''} onChange={hChange} />
            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit">{hotelForm.id ? 'Save changes' : 'Add hotel'}</button>
              {hotelForm.id && <button type="button" className="btn btn-outline-secondary" onClick={() => setHotelForm(emptyHotel)}>Cancel edit</button>}
            </div>
          </form>
        </div>

        <div className="col-lg-8">
          <div className="table-wrap table-responsive">
            <table className="table align-middle mb-0">
              <thead><tr><th>Hotel</th><th>City</th><th>Rating</th><th></th></tr></thead>
              <tbody>
                {hotels.map((h) => (
                  <tr key={h.id}>
                    <td>{h.name}</td>
                    <td>{h.city}</td>
                    <td>{h.rating ?? '-'}</td>
                    <td className="text-end text-nowrap">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openRooms(h)}>Rooms</button>
                      <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => setHotelForm(h)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeHotel(h)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {hotels.length === 0 && <tr><td colSpan="4" className="text-center text-muted py-4">No hotels yet. Add the first one.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <div className="mt-5">
          <h4>Rooms in {selected.name}</h4>
          <div className="row g-4">
            <div className="col-lg-4">
              <form className="bg-white p-3 rounded shadow-sm" onSubmit={saveRoom}>
                <h5>{roomForm.id ? 'Edit room type' : 'Add a room type'}</h5>
                <input className="form-control mb-2" name="roomType" placeholder="Room type (Deluxe, Suite...)" required value={roomForm.roomType} onChange={rChange} />
                <input className="form-control mb-2" name="pricePerNight" type="number" min="1" placeholder="Price per night" required value={roomForm.pricePerNight} onChange={rChange} />
                <input className="form-control mb-2" name="capacity" type="number" min="1" placeholder="Max guests" required value={roomForm.capacity} onChange={rChange} />
                <input className="form-control mb-2" name="totalRooms" type="number" min="1" placeholder="Number of rooms" required value={roomForm.totalRooms} onChange={rChange} />
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit">{roomForm.id ? 'Save room' : 'Add room'}</button>
                  {roomForm.id && <button type="button" className="btn btn-outline-secondary" onClick={() => setRoomForm(emptyRoom)}>Cancel edit</button>}
                </div>
              </form>
            </div>
            <div className="col-lg-8">
              <div className="table-wrap table-responsive">
                <table className="table align-middle mb-0">
                  <thead><tr><th>Type</th><th>Price</th><th>Guests</th><th>Rooms</th><th></th></tr></thead>
                  <tbody>
                    {rooms.map((r) => (
                      <tr key={r.id}>
                        <td>{r.roomType}</td>
                        <td>{money(r.pricePerNight)}</td>
                        <td>{r.capacity}</td>
                        <td>{r.totalRooms}</td>
                        <td className="text-end text-nowrap">
                          <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => setRoomForm(r)}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => removeRoom(r)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {rooms.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">No rooms yet. Add a room type.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
