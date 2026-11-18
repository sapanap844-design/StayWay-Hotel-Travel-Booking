import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchHotels, errorMessage } from '../services/api.js';
import HotelCard from '../components/HotelCard.jsx';

export default function Hotels() {
  const [params, setParams] = useSearchParams();
  const [city, setCity] = useState(params.get('city') || '');
  const [name, setName] = useState(params.get('name') || '');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load hotels whenever the URL search values change.
  useEffect(() => {
    setLoading(true);
    setError('');
    searchHotels(params.get('city') || '', params.get('name') || '')
      .then(setHotels)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [params]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setParams({ city, name });
  };

  return (
    <div className="container pb-5">
      <h2 className="page-title">Hotels</h2>

      <form className="row g-2 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-5">
          <input className="form-control" placeholder="City" aria-label="City" value={city}
                 onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="col-md-5">
          <input className="form-control" placeholder="Hotel name" aria-label="Hotel name" value={name}
                 onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="col-md-2 d-grid">
          <button className="btn btn-primary" type="submit">Search</button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p>Loading hotels...</p>}
      {!loading && !error && hotels.length === 0 && (
        <p className="text-muted">No hotels match your search. Try a different city or clear the name.</p>
      )}

      <div className="row g-4">
        {hotels.map((h) => (
          <div className="col-md-6 col-lg-4" key={h.id}><HotelCard hotel={h} /></div>
        ))}
      </div>
    </div>
  );
}
