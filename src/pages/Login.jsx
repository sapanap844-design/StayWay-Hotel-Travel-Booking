import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { errorMessage, loginUser } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await loginUser(form);
      login(user);
      navigate(location.state?.from || (user.role === 'ADMIN' ? '/admin' : '/'), { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 460 }}>
      <h2 className="mb-3">Log in</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="form-control" required value={form.email} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className="form-control" required value={form.password} onChange={handleChange} />
        </div>
        <button className="btn btn-primary w-100" type="submit">Log in</button>
      </form>
      <p className="mt-3">New here? <Link to="/register">Create an account</Link></p>
    </div>
  );
}
