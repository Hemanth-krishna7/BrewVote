import api from './api';

const voteService = {
  /**
   * Cast a vote for a coffee listing
   * @param {string} coffeeId
   */
  voteForCoffee: async (coffeeId) => {
    const response = await api.post(`/votes/${coffeeId}`);
    if (response.data && response.data.data) {
      return {
        success: response.data.success,
        message: response.data.message,
        totalVotes: response.data.data.totalVotes
      };
    }
    return response.data;
  },

  /**
   * Check if user has voted for this coffee listing
   * @param {string} coffeeId
   */
  checkVoteStatus: async (coffeeId) => {
    const response = await api.get(`/votes/check/${coffeeId}`);
    if (response.data && response.data.data) {
      return {
        success: response.data.success,
        message: response.data.message,
        hasVoted: response.data.data.hasVoted
      };
    }
    return response.data;
  },

  /**
   * Get the top 10 coffees sorted by votes
   */
  getLeaderboard: async () => {
    const response = await api.get('/votes/leaderboard');
    if (response.data && response.data.data) {
      return {
        success: response.data.success,
        message: response.data.message,
        coffees: response.data.data.coffees
      };
    }
    return response.data;
  }
};

export default voteService;
