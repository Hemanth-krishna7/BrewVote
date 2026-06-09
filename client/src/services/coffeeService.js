import api from './api';

const coffeeService = {
  /**
   * Fetch active coffees with optional search, pagination filters
   * @param {string} search - search term for query
   * @param {number} page - current page offset
   * @param {number} limit - items per page limit
   */
  getAllCoffees: async (search = '', page = 1, limit = 12) => {
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/coffees?${params.toString()}`);
    if (response.data && response.data.data) {
      return {
        success: response.data.success,
        message: response.data.message,
        coffees: response.data.data.coffees,
        pagination: response.data.data.pagination
      };
    }
    return response.data;
  },

  /**
   * Fetch single coffee details by ID
   * @param {string} id
   */
  getCoffeeById: async (id) => {
    const response = await api.get(`/coffees/${id}`);
    return response.data; // Already returns { success, data: coffee }
  },

  /**
   * Submit new coffee listing creation request
   * @param {object} coffeeData
   */
  createCoffee: async (coffeeData) => {
    const response = await api.post('/coffees', coffeeData);
    return response.data; // Already returns { success, message, data: coffee }
  },

  /**
   * Submit updates to a coffee listing
   * @param {string} id
   * @param {object} coffeeData
   */
  updateCoffee: async (id, coffeeData) => {
    const response = await api.put(`/coffees/${id}`, coffeeData);
    return response.data; // Already returns { success, message, data: coffee }
  },

  /**
   * Send request to soft-delete a coffee listing
   * @param {string} id
   */
  deleteCoffee: async (id) => {
    const response = await api.delete(`/coffees/${id}`);
    return response.data; // Already returns { success, message, data: {} }
  }
};

export default coffeeService;
