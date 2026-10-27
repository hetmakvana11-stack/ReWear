import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  ArrowLeftRight,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Sparkles,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { dashboardApi } from '../api/userApi';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate, timeAgo } from '../utils/formatDate';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const PIE_COLORS = ['#346B54', '#2B5B47', '#E11D48', '#D97706', '#64748B'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [statsRes, activityRes] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getActivity(),
        ]);

        if (statsRes && statsRes.data) setStats(statsRes.data);
        if (activityRes && activityRes.data) setActivity(activityRes.data);
      } catch (err) {
        toast.error(err.message || 'Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Computing live marketplace metrics..." />
      </div>
    );
  }

  const overview = stats?.overview || {};
  const userStats = stats?.userStats || {};
  const categoryStats = stats?.categoryStats || [];
  const requestStats = stats?.requestStats || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-900 text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-forest-700" />
            <span>MongoDB Live Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 font-editorial">
            Campus Marketplace Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-600 mt-1">
            Real-time insights across items listed, circular swaps, and student inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/sell" className="btn-primary text-xs py-2 px-4">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post Item</span>
          </Link>
          <Link to="/marketplace" className="btn-outline text-xs py-2 px-4">
            Explore All
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Listings */}
        <div className="bg-white border border-border p-5 rounded-2xl shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-500">
              Total Listings
            </span>
            <div className="w-8 h-8 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-dark-900 font-editorial">
            {overview.totalListings || 0}
          </p>
          <p className="text-xs text-muted-600 mt-1">
            <strong className="text-forest-800 font-semibold">{overview.activeListings || 0}</strong> active on campus
          </p>
        </div>

        {/* Total Requests */}
        <div className="bg-white border border-border p-5 rounded-2xl shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-500">
              Trade Inquiries
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-dark-900 font-editorial">
            {overview.totalRequests || 0}
          </p>
          <p className="text-xs text-muted-600 mt-1">
            <strong className="text-blue-800 font-semibold">{overview.pendingRequests || 0}</strong> pending response
          </p>
        </div>

        {/* Accepted Trades */}
        <div className="bg-white border border-border p-5 rounded-2xl shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-500">
              Successful Trades
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-dark-900 font-editorial">
            {overview.acceptedRequests || 0}
          </p>
          <p className="text-xs text-muted-600 mt-1">
            Items saved from waste
          </p>
        </div>

        {/* Registered Students */}
        <div className="bg-white border border-border p-5 rounded-2xl shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-500">
              Campus Members
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-dark-900 font-editorial">
            {overview.totalUsers || 0}
          </p>
          <p className="text-xs text-muted-600 mt-1">
            Verified university accounts
          </p>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-7 bg-white border border-border rounded-2xl p-6 shadow-subtle">
          <div className="mb-4">
            <h3 className="text-base font-bold text-dark-900 font-editorial">
              Listings Distribution by Category
            </h3>
            <p className="text-xs text-muted-500">
              Aggregated in real-time from active MongoDB listings
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 11, fill: '#777D75' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11, fill: '#777D75' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#20251F',
                    color: '#FFF',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#234D3C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Request Status Breakdown Pie Chart */}
        <div className="lg:col-span-5 bg-white border border-border rounded-2xl p-6 shadow-subtle flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-base font-bold text-dark-900 font-editorial">
              Inquiry Status Breakdown
            </h3>
            <p className="text-xs text-muted-500">
              Status of all peer purchase & swap proposals
            </p>
          </div>

          <div className="h-56 w-full">
            {requestStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={requestStats}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {requestStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#20251F',
                      color: '#FFF',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(val) => (
                      <span className="text-xs font-medium text-dark-800 capitalize">
                        {val}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-500">
                No request statistics yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Listings */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <h3 className="text-base font-bold text-dark-900 font-editorial">
              Recent Campus Listings
            </h3>
            <Link to="/marketplace" className="text-xs font-semibold text-forest-800 hover:text-forest-900">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {activity?.recentListings?.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-ivory-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.images?.[0] || 'https://via.placeholder.com/60'}
                    alt={item.title}
                    className="w-10 h-10 rounded-lg object-cover border border-border shrink-0"
                  />
                  <div className="min-w-0">
                    <Link
                      to={`/listings/${item._id}`}
                      className="text-xs font-bold text-dark-900 hover:text-forest-800 truncate block"
                    >
                      {item.title}
                    </Link>
                    <p className="text-[11px] text-muted-500">
                      by {item.seller?.name} • {timeAgo(item.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-forest-900">
                    {formatCurrency(item.price, item.listingType)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trade Activity */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <h3 className="text-base font-bold text-dark-900 font-editorial">
              Your Recent Trade Inquiries
            </h3>
            <Link to="/my-requests" className="text-xs font-semibold text-forest-800 hover:text-forest-900">
              Manage Requests →
            </Link>
          </div>

          <div className="space-y-3">
            {activity?.recentRequests?.length > 0 ? (
              activity.recentRequests.map((req) => (
                <div
                  key={req._id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-ivory-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-dark-900 truncate">
                      {req.listing?.title || 'Listing Item'}
                    </p>
                    <p className="text-[11px] text-muted-500 mt-0.5">
                      {req.buyer?.name} ➔ {req.seller?.name} • {timeAgo(req.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`badge text-[10px] font-semibold uppercase ${
                      req.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-500 text-center py-8">
                No recent inquiry activity found for your account.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
