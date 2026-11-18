import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchHotels } from '../services/api.js';
import HotelCard from '../components/HotelCard.jsx';

export default function Home() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [top, setTop] = useState([]);

  useEffect(() => {
    searchHotels().then((list) => setTop(list.slice(0, 3))).catch(() => setTop([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/hotels?city=${encodeURIComponent(city)}&name=${encodeURIComponent(name)}`);
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Book a room that fits the trip.</h1>
          <p>Compare hotels by city, check which rooms are free on your dates, and confirm in a minute.</p>
        </div>
      </section>

      <div className="container">
        <form className="search-panel row g-2 align-items-end" onSubmit={handleSearch}>
          <div className="col-md-5">
            <label className="form-label" htmlFor="city">City</label>
            <input id="city" className="form-control" placeholder="Goa, Jaipur, Manali..." value={city}
                   onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="col-md-5">
            <label className="form-label" htmlFor="hname">Hotel name (optional)</label>
            <input id="hname" className="form-control" placeholder="Resort, Palace..." value={name}
                   onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-primary" type="submit">Search hotels</button>
          </div>
        </form>

        <h2 className="page-title">Top rated stays</h2>
        <div className="row g-4">
          {top.map((h) => (
            <div className="col-md-4" key={h.id}><HotelCard hotel={h} /></div>
          ))}
          {top.length === 0 && <p className="text-muted">No hotels to show yet. Is the backend running?</p>}
        </div>

        <div className="text-center my-5">
          <Link to="/packages" className="btn btn-outline-primary">See travel packages</Link>
        </div>
      </div>
    </>
  );
}
