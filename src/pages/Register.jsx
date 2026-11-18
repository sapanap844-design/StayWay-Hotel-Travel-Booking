import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { errorMessage, registerUser } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await registerUser(form);
      login(user); // log the new user in straight away
      navigate('/');
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 460 }}>
      <h2 className="mb-3">Create your account</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label" htmlFor="name">Full name</label>
          <input id="name" name="name" className="form-control" required value={form.name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="form-control" required value={form.email} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" className="form-control" value={form.phone} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="password">Password (min 6 characters)</label>
          <input id="password" name="password" type="password" minLength="6" className="form-control" required
                 value={form.password} onChange={handleChange} />
        </div>
        <button className="btn btn-primary w-100" type="submit">Sign up</button>
      </form>
      <p className="mt-3">Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}
