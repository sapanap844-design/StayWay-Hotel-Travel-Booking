import { Link } from 'react-router-dom';

export default function HotelCard({ hotel }) {
  return (
    <div className="card hotel-card">
      <div className="card-img-box">
        {hotel.imageUrl ? (
          <img src={hotel.imageUrl} alt={hotel.name} />
        ) : (
          <div className="img-placeholder">{hotel.name.charAt(0)}</div>
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className="card-title mb-1">{hotel.name}</h5>
          {hotel.rating != null && <span className="badge rating-badge">{hotel.rating}</span>}
        </div>
        <p className="text-muted mb-2">{hotel.city}</p>
        <p className="small flex-grow-1">{hotel.description}</p>
        <Link to={`/hotels/${hotel.id}`} className="btn btn-primary mt-2">View rooms</Link>
      </div>
    </div>
  );
}
