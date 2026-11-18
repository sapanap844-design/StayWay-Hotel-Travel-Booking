import { useEffect, useState } from 'react';
import { adminDeletePackage, adminSavePackage, errorMessage, getPackages } from '../../services/api.js';
import { money } from '../../utils.js';

const emptyForm = { title: '', destination: '', description: '', price: '', durationDays: '', imageUrl: '' };

export default function ManagePackages() {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = () => getPackages().then(setPackages).catch((err) => setError(errorMessage(err)));
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    try {
      await adminSavePackage({ ...form, price: Number(form.price), durationDays: Number(form.durationDays) });
      setMessage(form.id ? 'Package updated.' : 'Package added.');
      setError('');
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(errorMessage(err));
      setMessage('');
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete package ${p.title}?`)) return;
    try {
      await adminDeletePackage(p.id);
      setMessage('Package deleted.');
      setError('');
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="container pb-5">
      <h2 className="page-title">Manage travel packages</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="row g-4">
        <div className="col-lg-4">
          <form className="bg-white p-3 rounded shadow-sm" onSubmit={save}>
            <h5>{form.id ? 'Edit package' : 'Add a package'}</h5>
            <input className="form-control mb-2" name="title" placeholder="Title" required value={form.title} onChange={handleChange} />
            <input className="form-control mb-2" name="destination" placeholder="Destination" required value={form.destination} onChange={handleChange} />
            <input className="form-control mb-2" name="price" type="number" min="1" placeholder="Price per person" required value={form.price} onChange={handleChange} />
            <input className="form-control mb-2" name="durationDays" type="number" min="1" placeholder="Days" required value={form.durationDays} onChange={handleChange} />
            <input className="form-control mb-2" name="imageUrl" placeholder="Image URL" value={form.imageUrl || ''} onChange={handleChange} />
            <textarea className="form-control mb-2" name="description" rows="3" placeholder="Description" value={form.description || ''} onChange={handleChange} />
            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit">{form.id ? 'Save changes' : 'Add package'}</button>
              {form.id && <button type="button" className="btn btn-outline-secondary" onClick={() => setForm(emptyForm)}>Cancel edit</button>}
            </div>
          </form>
        </div>

        <div className="col-lg-8">
          <div className="table-wrap table-responsive">
            <table className="table align-middle mb-0">
              <thead><tr><th>Package</th><th>Destination</th><th>Days</th><th>Price</th><th></th></tr></thead>
              <tbody>
                {packages.map((p) => (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>{p.destination}</td>
                    <td>{p.durationDays}</td>
                    <td>{money(p.price)}</td>
                    <td className="text-end text-nowrap">
                      <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => setForm(p)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => remove(p)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {packages.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">No packages yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
