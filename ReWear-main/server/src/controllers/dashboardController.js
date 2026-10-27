const Listing = require('../models/Listing');
const Request = require('../models/Request');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get dashboard metrics & aggregation stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Global / Platform Overview
  const totalListings = await Listing.countDocuments();
  const activeListings = await Listing.countDocuments({ status: 'active' });
  const completedListings = await Listing.countDocuments({
    status: { $in: ['reserved', 'sold', 'exchanged'] },
  });

  const totalRequests = await Request.countDocuments();
  const pendingRequests = await Request.countDocuments({ status: 'pending' });
  const acceptedRequests = await Request.countDocuments({ status: 'accepted' });
  const totalUsers = await User.countDocuments();

  // User-specific quick stats
  const myListingsCount = await Listing.countDocuments({ seller: userId });
  const mySentRequestsCount = await Request.countDocuments({ buyer: userId });
  const myReceivedRequestsCount = await Request.countDocuments({ seller: userId });
  const myPendingReceivedCount = await Request.countDocuments({ seller: userId, status: 'pending' });

  // Category distribution aggregation
  const categoryStats = await Listing.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Request status distribution aggregation
  const requestStats = await Request.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Listing type distribution
  const listingTypeStats = await Listing.aggregate([
    { $group: { _id: '$listingType', count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    success: true,
    message: 'Dashboard statistics calculated',
    data: {
      overview: {
        totalListings,
        activeListings,
        completedListings,
        totalRequests,
        pendingRequests,
        acceptedRequests,
        totalUsers,
      },
      userStats: {
        myListingsCount,
        mySentRequestsCount,
        myReceivedRequestsCount,
        myPendingReceivedCount,
      },
      categoryStats: categoryStats.map((item) => ({
        category: item._id,
        count: item.count,
      })),
      requestStats: requestStats.map((item) => ({
        status: item._id,
        count: item.count,
      })),
      listingTypeStats: listingTypeStats.map((item) => ({
        type: item._id,
        count: item.count,
      })),
    },
  });
});

// @desc    Get recent platform activity & recent listings
// @route   GET /api/dashboard/activity
// @access  Private
const getDashboardActivity = asyncHandler(async (req, res) => {
  const recentListings = await Listing.find()
    .populate('seller', 'name college avatar')
    .sort({ createdAt: -1 })
    .limit(5);

  const recentRequests = await Request.find({
    $or: [{ seller: req.user._id }, { buyer: req.user._id }],
  })
    .populate('listing', 'title images price')
    .populate('buyer', 'name college avatar')
    .populate('seller', 'name college avatar')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    message: 'Dashboard recent activity fetched',
    data: {
      recentListings,
      recentRequests,
    },
  });
});

module.exports = {
  getDashboardStats,
  getDashboardActivity,
};
