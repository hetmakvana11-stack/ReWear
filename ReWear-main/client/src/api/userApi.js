import api from './axios';

export const userApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.patch('/users/me', data),
  getWishlist: () => api.get('/users/me/wishlist'),
  addToWishlist: (listingId) => api.post(`/users/me/wishlist/${listingId}`),
  removeFromWishlist: (listingId) => api.delete(`/users/me/wishlist/${listingId}`),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getActivity: () => api.get('/dashboard/activity'),
};
