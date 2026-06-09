import { useState, useEffect, useCallback } from 'react';

const useFetch = (fetchFunction, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFunction(...args);
      setData(response);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data.');
      setLoading(false);
      throw err;
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute };
};

export default useFetch;
