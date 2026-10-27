import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  ArrowLeftRight,
  ShieldCheck,
  Tag,
  Calendar,
  School,
  User,
  Sparkles,
  Edit,
  Info,
} from 'lucide-react';
import { listingApi } from '../api/listingApi';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import RequestModal from '../components/RequestModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import toast from 'react-hot-toast';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleWishlist, isInWishlist } = useAuth();

  const [listing, setListing] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Request modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [requestType, setRequestType] = useState('purchase');

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listingApi.getListingById(id);
      if (res && res.data) {
        setListing(res.data);
      }
    } catch (err) {
      setError(err.message || 'Unable to load listing details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading product details..." />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <ErrorMessage
          message={error || 'This listing does not exist or may have been removed.'}
          onRetry={fetchListing}
        />
        <Link to="/marketplace" className="btn-outline mt-4 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const isOwner = user && user._id === listing.seller?._id;
  const isAvailable = listing.status === 'active';
  const isFavorited = isInWishlist(listing._id);

  const handleOpenRequest = (type) => {
    if (!user) {
      toast.error('Please log in to contact the seller.');
      navigate('/login', { state: { from: { pathname: `/listings/${id}` } } });
      return;
    }
    setRequestType(type);
    setModalOpen(true);
  };

  const images = listing.images?.length > 0 ? listing.images : [FALLBACK_IMAGE];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-600 hover:text-dark-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-ivory-200 border border-border shadow-card">
            <img
              src={images[selectedImage] || FALLBACK_IMAGE}
              alt={listing.title}
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
              className="w-full h-full object-cover object-center"
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="badge bg-dark-900/90 text-white backdrop-blur-md text-xs px-3 py-1 font-semibold uppercase">
                {listing.listingType}
              </span>
              <span className="badge bg-white/90 text-dark-900 backdrop-blur-md text-xs px-3 py-1 font-semibold border border-border">
                {listing.condition} Condition
              </span>
              {listing.status !== 'active' && (
                <span className="badge bg-amber-500 text-white font-bold uppercase tracking-wider text-xs px-3 py-1 shadow-md">
                  {listing.status}
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(listing._id)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/95 backdrop-blur-md text-dark-900 shadow-md hover:scale-105 active:scale-95 transition-all"
              aria-label="Toggle Wishlist"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorited ? 'fill-rose-500 text-rose-500' : 'text-dark-800'
                }`}
              />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === idx
                      ? 'border-forest-800 ring-2 ring-forest-800/20'
                      : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-forest-800 uppercase tracking-wider mb-2">
              <span>{listing.category}</span>
              {listing.size && listing.size !== 'N/A' && (
                <>
                  <span>•</span>
                  <span>Size {listing.size}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 font-editorial leading-tight">
              {listing.title}
            </h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-forest-900 font-editorial">
                {formatCurrency(listing.price, listing.listingType)}
              </span>
              {listing.listingType === 'For Exchange' && (
                <span className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Available for trade
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {isOwner ? (
              <div className="p-4 bg-forest-50 border border-forest-200 rounded-2xl space-y-3">
                <p className="text-xs font-semibold text-forest-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-forest-700" />
                  You are the owner of this campus listing.
                </p>
                <div className="flex gap-2">
                  <Link to={`/listings/${listing._id}/edit`} className="btn-primary flex-1 text-xs py-2.5">
                    <Edit className="w-4 h-4" />
                    Edit Listing Details
                  </Link>
                  <Link to="/my-listings" className="btn-outline flex-1 text-xs py-2.5">
                    View My Listings
                  </Link>
                </div>
              </div>
            ) : isAvailable ? (
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpenRequest('purchase')}
                    className="btn-primary py-3 text-sm justify-center shadow-card font-semibold"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Send Purchase Request
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenRequest('exchange')}
                    className="btn-secondary py-3 text-sm justify-center font-semibold border border-forest-200"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    Send Exchange Request
                  </button>
                </div>

                <p className="text-[11px] text-muted-500 text-center">
                  Submitting a request contacts the student seller directly on campus.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-gray-100 border border-gray-200 rounded-2xl text-center">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Item Currently {listing.status}
                </p>
                <p className="text-xs text-muted-600 mt-1">
                  This item has already been reserved, sold, or exchanged by another student.
                </p>
              </div>
            )}
          </div>

          {/* Exchange Preference Alert if any */}
          {listing.exchangePreference && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5" />
                Seller's Trade Preference
              </span>
              <p className="text-xs text-emerald-950 leading-relaxed">
                {listing.exchangePreference}
              </p>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2 border-t border-border pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark-900">
              Product Description
            </h3>
            <p className="text-xs sm:text-sm text-dark-800 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
            <div className="bg-white p-3 rounded-xl border border-border">
              <span className="text-muted-500 block text-[11px]">Category</span>
              <span className="font-semibold text-dark-900">{listing.category}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-border">
              <span className="text-muted-500 block text-[11px]">Condition</span>
              <span className="font-semibold text-dark-900">{listing.condition}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-border">
              <span className="text-muted-500 block text-[11px]">Size</span>
              <span className="font-semibold text-dark-900">{listing.size || 'N/A'}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-border">
              <span className="text-muted-500 block text-[11px]">Listed Date</span>
              <span className="font-semibold text-dark-900">{formatDate(listing.createdAt)}</span>
            </div>
          </div>

          {/* Seller Card */}
          <div className="bg-white p-4 rounded-2xl border border-border shadow-subtle flex items-center gap-4">
            {listing.seller?.avatar ? (
              <img
                src={listing.seller.avatar}
                alt={listing.seller.name}
                className="w-12 h-12 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-base">
                {listing.seller?.name?.charAt(0) || <User className="w-6 h-6" />}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-dark-900 truncate">
                {listing.seller?.name || 'Campus Student'}
              </h4>
              <p className="text-xs text-muted-600 flex items-center gap-1 mt-0.5">
                <School className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                <span className="truncate">{listing.seller?.college || 'College Campus'}</span>
              </p>
              <p className="text-[10px] text-muted-500 mt-0.5">
                Member since {formatDate(listing.seller?.createdAt)}
              </p>
            </div>
          </div>

          {/* Campus Non-Payment Disclaimer */}
          <div className="flex items-start gap-2.5 p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-2xl text-[11px] text-amber-900 leading-relaxed">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>ReWear Campus Note:</strong> Requests signal intent to buy or trade. No online credit card transactions occur on ReWear. Always meet peers in verified public campus areas.
            </span>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <RequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        listing={listing}
        initialType={requestType}
        onSuccess={fetchListing}
      />
    </div>
  );
};

export default ListingDetails;
