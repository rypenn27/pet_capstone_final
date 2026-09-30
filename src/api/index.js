import axios from 'axios';

const TOKEN_KEY = 'token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) =>
  token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turns an axios error into the server's message
export function errorMessage(error) {
  if (error && error.response && error.response.data && error.response.data.error) {
    return error.response.data.error;
  }
  return 'Something went wrong. Please try again.';
}

const data = (promise) => promise.then((res) => res.data);

// Config
export const getConfig = () => data(api.get('/config'));

// Auth
export const register = (fields) => data(api.post('/register', fields));
export const login = (username, password) =>
  data(api.post('/login', { username, password }));

// Pets
export const getPets = (search = '') => data(api.get('/pets', { params: { search } }));

// Basket
export const getCart = () => data(api.get('/cart'));
export const addToCart = (petId) => data(api.post('/cart', { petId }));
export const removeFromCart = (petId) => data(api.delete(`/cart/${petId}`));

// Account
export const getAccount = () => data(api.get('/account'));
export const updateProfile = (fields) => data(api.patch('/account', fields));
export const saveBilling = (fields) => data(api.put('/account/billing', fields));
export const createSetupIntent = () => data(api.post('/account/cards/setup-intent'));
export const saveCard = (paymentMethodId) =>
  data(api.post('/account/cards', { paymentMethodId }));
export const setDefaultCard = (id) => data(api.patch(`/account/cards/${id}/default`));
export const deleteCard = (id) => data(api.delete(`/account/cards/${id}`));

// Checkout and orders
export const checkout = (cardId) => data(api.post('/checkout', { cardId }));
export const completeCheckout = (paymentIntentId) =>
  data(api.post('/checkout/complete', { paymentIntentId }));
export const getOrders = () => data(api.get('/orders'));
export const getOrder = (id) => data(api.get(`/orders/${id}`));
