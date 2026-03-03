import axios from 'axios';

const BASE = 'https://car-rental-bqt8.onrender.com/api/';
const getToken = () => localStorage.getItem('token');

const client = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export const api = {
  auth: {
    register: (body) => client.post('/auth/register', body),
    login: (body) => client.post('/auth/login', body),
    getMe: () => client.get('/auth/me'),
  },
  drivers: {
    register: (body) => client.post('/drivers/register', body),
    getProfile: () => client.get('/drivers/profile'),
    getMyRides: () => client.get('/drivers/rides'),
    getAvailableRides: () => client.get('/drivers/available'),
  },
  rides: {
    estimateFare: (params) => client.get('/rides/estimate', { params }),
    create: (body) => client.post('/rides', body),
    getMy: () => client.get('/rides/my'),
    getOne: (id) => client.get('/rides/' + id),
    updateStatus: (id, status) => client.put('/rides/' + id + '/status', { status }),
    accept: (id) => client.put('/rides/' + id + '/accept'),
  },
  payments: {
    create: (body) => client.post('/payments', body),
    getMy: () => client.get('/payments/my'),
    getReceipt: (id) => client.get('/payments/' + id + '/receipt'),
  },
  categories: {
    getAll: () => client.get('/categories'),
  },
  cars: {
    getAll: (params) => client.get('/cars', { params }),
    getOne: (id) => client.get('/cars/' + id),
  },
  bookings: {
    create: (body) => client.post('/bookings', body),
    getMy: () => client.get('/bookings/my'),
    getOne: (id) => client.get('/bookings/' + id),
    cancel: (id) => client.put('/bookings/' + id + '/cancel'),
  },
};
