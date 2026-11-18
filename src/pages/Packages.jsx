import { useEffect, useState } from 'react';
import { errorMessage, getPackages } from '../services/api.js';
import { money } from '../utils.js';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getPackages().then(setPackages).catch((err) => setError(errorMessage(err)));
  }, []);

  return (
    <div className="container pb-5">
      <h2 className="page-title">Travel packages</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-4">
        {packages.map((p) => (
          <div className="col-md-6 col-lg-4" key={p.id}>
            <div className="card package-card">
              <div className="card-img-box">
                {p.imageUrl ? <img src={p.imageUrl} alt={p.title} /> : <div className="img-placeholder">{p.title.charAt(0)}</div>}
              </div>
              <div className="card-body">
                <h5 className="card-title">{p.title}</h5>
                <p className="text-muted mb-2">{p.destination} - {p.durationDays} days</p>
                <p className="small">{p.description}</p>
                <div className="price-text">{money(p.price)} <span className="small text-muted fw-normal">per person</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!error && packages.length === 0 && <p className="text-muted">No packages available right now.</p>}
    </div>
  );
}
