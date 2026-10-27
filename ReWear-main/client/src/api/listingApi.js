import api from './axios';

export const listingApi = {
  getListings: (params = {}) => api.get('/listings', { params }),
  getFeaturedListings: () => api.get('/listings/featured'),
  getListingById: (id) => api.get(`/listings/${id}`),
  createListing: (data) => api.post('/listings', data),
  updateListing: (id, data) => api.put(`/listings/${id}`, data),
  deleteListing: (id) => api.delete(`/listings/${id}`),
  getMyListings: () => api.get('/listings/mine'),
};
