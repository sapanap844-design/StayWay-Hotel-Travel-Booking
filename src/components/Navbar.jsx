import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg site-nav">
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={close}>StayWay</Link>
        <button
          className="navbar-toggler navbar-dark"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/hotels" onClick={close}>Hotels</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/packages" onClick={close}>Travel packages</NavLink></li>
            {user && (
              <li className="nav-item"><NavLink className="nav-link" to="/my-bookings" onClick={close}>My bookings</NavLink></li>
            )}
            {isAdmin && (
              <li className="nav-item"><NavLink className="nav-link" to="/admin" onClick={close}>Admin</NavLink></li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <span className="text-white-50 me-2">Hi, {user.name}</span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/login" onClick={close}>Log in</Link>
                <Link className="btn btn-brass btn-sm" to="/register" onClick={close}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
