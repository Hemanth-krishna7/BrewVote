const Vote = require('../models/Vote');
const Coffee = require('../models/Coffee');

/**
 * @desc    Cast a vote for a coffee listing
 * @route   POST /api/votes/:coffeeId
 * @access  Private
 */
const castVote = async (req, res, next) => {
  try {
    const { coffeeId } = req.params;

    // Verify coffee exists and is active
    const coffee = await Coffee.findOne({ _id: coffeeId, isActive: true });
    if (!coffee) {
      return res.status(404).json({
        success: false,
        message: 'Coffee listing not found or is inactive.'
      });
    }

    // Prevent owners from voting for their own coffee
    if (coffee.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot vote for your own brew.'
      });
    }

    try {
      // Create Vote document first (relies on compound unique index `{ user, coffee }`)
      await Vote.create({
        user: req.user._id,
        coffee: coffeeId
      });

      // Increment Coffee.totalVotes using $inc atomically
      const updatedCoffee = await Coffee.findByIdAndUpdate(
        coffeeId,
        { $inc: { totalVotes: 1 } },
        { new: true }
      );

      return res.status(201).json({
        success: true,
        message: 'Vote successfully recorded.',
        data: {
          totalVotes: updatedCoffee.totalVotes
        }
      });
    } catch (dbError) {
      // Catch MongoDB duplicate key error (code 11000)
      if (dbError.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'You have already voted for this coffee.'
        });
      }
      throw dbError; // Pass other errors
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check if the authenticated user has voted for a coffee listing
 * @route   GET /api/votes/check/:coffeeId
 * @access  Private
 */
const checkVote = async (req, res, next) => {
  try {
    const { coffeeId } = req.params;

    const vote = await Vote.findOne({
      user: req.user._id,
      coffee: coffeeId
    });

    return res.status(200).json({
      success: true,
      message: 'Vote check completed.',
      data: {
        hasVoted: !!vote
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get top 10 active coffees sorted by totalVotes descending
 * @route   GET /api/votes/leaderboard
 * @access  Public
 */
const getLeaderboard = async (req, res, next) => {
  try {
    const coffees = await Coffee.find({ isActive: true })
      .sort({ totalVotes: -1, name: 1 })
      .limit(10)
      .select('name totalVotes imageUrl slug');

    return res.status(200).json({
      success: true,
      message: 'Leaderboard retrieved successfully.',
      data: {
        coffees
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  castVote,
  checkVote,
  getLeaderboard
};
