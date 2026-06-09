import api from './api';

const authService = {
  /**
   * Submit credentials to authenticate user
   * @param {string} email
   * @param {string} password
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.data) {
      return {
        success: response.data.success,
        message: response.data.message,
        token: response.data.data.token,
        user: response.data.data.user
      };
    }
    return response.data;
  },

  /**
   * Submit registration info to create a new user profile
   * @param {string} name
   * @param {string} email
   * @param {string} password
   */
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data && response.data.data) {
      return {
        success: response.data.success,
        message: response.data.message,
        token: response.data.data.token,
        user: response.data.data.user
      };
    }
    return response.data;
  }
};

export default authService;
