import axios from 'axios';

// One axios object that knows the backend address.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

// Before every request, add the login token (if the user is logged in).
api.interceptors.request.use((config) => {
  const saved = localStorage.getItem('user');
  if (saved) {
    try {
      const { token } = JSON.parse(saved);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      /* ignore broken data */
    }
  }
  return config;
});

/** Pulls a readable message out of an API error. */
export const errorMessage = (err) =>
  err.response?.data?.message || 'Cannot reach the server. Is the backend running on port 8080?';

const data = (promise) => promise.then((res) => res.data);

// ---- Auth ----
export const registerUser = (body) => data(api.post('/auth/register', body));
export const loginUser = (body) => data(api.post('/auth/login', body));

// ---- Hotels (public) ----
export const searchHotels = (city = '', name = '') => data(api.get('/hotels', { params: { city, name } }));
export const getHotel = (id) => data(api.get(`/hotels/${id}`));
export const getAvailability = (id, checkIn, checkOut) =>
  data(api.get(`/hotels/${id}/availability`, { params: { checkIn, checkOut } }));
export const getRooms = (id) => data(api.get(`/hotels/${id}/rooms`));

// ---- Packages (public) ----
export const getPackages = () => data(api.get('/packages'));

// ---- Bookings (logged in) ----
export const createBooking = (body) => data(api.post('/bookings', body));
export const getMyBookings = () => data(api.get('/bookings/my'));
export const cancelBooking = (id) => data(api.put(`/bookings/${id}/cancel`));

// ---- Admin ----
export const getDashboard = () => data(api.get('/admin/dashboard'));
export const getAllBookings = () => data(api.get('/admin/bookings'));
export const adminSaveHotel = (hotel) =>
  hotel.id ? data(api.put(`/admin/hotels/${hotel.id}`, hotel)) : data(api.post('/admin/hotels', hotel));
export const adminDeleteHotel = (id) => api.delete(`/admin/hotels/${id}`);
export const adminSaveRoom = (hotelId, room) =>
  room.id ? data(api.put(`/admin/rooms/${room.id}`, room)) : data(api.post(`/admin/hotels/${hotelId}/rooms`, room));
export const adminDeleteRoom = (id) => api.delete(`/admin/rooms/${id}`);
export const adminSavePackage = (p) =>
  p.id ? data(api.put(`/admin/packages/${p.id}`, p)) : data(api.post('/admin/packages', p));
export const adminDeletePackage = (id) => api.delete(`/admin/packages/${id}`);
