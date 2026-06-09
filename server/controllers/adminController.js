const User = require('../models/User');
const Coffee = require('../models/Coffee');
const Vote = require('../models/Vote');

/**
 * @desc    Get admin statistics/metrics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCoffees = await Coffee.countDocuments({ isActive: true });
    const totalVotes = await Vote.countDocuments();

    // Retrieve active coffee with the highest vote count
    const topCoffee = await Coffee.findOne({ isActive: true })
      .sort({ totalVotes: -1, name: 1 })
      .select('name totalVotes');

    const mostVotedCoffee = topCoffee 
      ? { name: topCoffee.name, totalVotes: topCoffee.totalVotes } 
      : null;

    return res.status(200).json({
      success: true,
      message: 'Admin metrics successfully retrieved.',
      data: {
        totalUsers,
        totalCoffees,
        totalVotes,
        mostVotedCoffee
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats
};
