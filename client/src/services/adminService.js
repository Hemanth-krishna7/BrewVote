import api from './api';

const adminService = {
  /**
   * Fetch aggregate admin statistics (users, coffees, votes, top voted coffee)
   */
  getStats: async () => {
    const response = await api.get('/admin/stats');
    if (response.data && response.data.data) {
      return {
        success: response.data.success,
        message: response.data.message,
        totalUsers: response.data.data.totalUsers,
        totalCoffees: response.data.data.totalCoffees,
        totalVotes: response.data.data.totalVotes,
        mostVotedCoffee: response.data.data.mostVotedCoffee
      };
    }
    return response.data;
  }
};

export default adminService;
