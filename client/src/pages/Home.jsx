import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import coffeeService from '../services/coffeeService';
import voteService from '../services/voteService';
import { useAuth } from '../context/AuthContext';
import { Coffee, ArrowRight, Star, Search, ChevronLeft, ChevronRight, Loader2, Award } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [coffees, setCoffees] = useState([]);
  const [topBrews, setTopBrews] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCoffees, setTotalCoffees] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fallbackImage = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085';

  // Fetch all coffees matching filters
  useEffect(() => {
    const fetchCoffees = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await coffeeService.getAllCoffees(search, page, 6);
        if (data.success) {
          setCoffees(data.coffees);
          setTotalPages(data.pagination.pages || 1);
          setTotalCoffees(data.pagination.total);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error fetching coffee catalog.');
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      fetchCoffees();
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, page]);

  // Fetch top 3 coffees for leaderboard section
  const fetchLeaderboard = async () => {
    try {
      const res = await voteService.getLeaderboard();
      if (res.success) {
        setTopBrews(res.coffees.slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-slate-900 border-b border-slate-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-950 text-slate-400 text-sm mb-6">
            <Coffee className="h-4 w-4 text-brand-500" />
            <span>Coffee Discovery & Voting Platform</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Discover the World's Finest Brews.
            <span className="block text-brand-500">Vote for Your Favorites.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 px-2">
            Browse global coffee varieties, submit new roasts, and cast votes to rank the finest brews in our community listing.
          </p>
          <div className="flex flex-wrap justify-center gap-3 px-4">
            {(!isAuthenticated || user?.role !== 'admin') && (
              <Link
                to="/create-coffee"
                className="inline-flex items-center gap-2 px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-md transition-colors"
              >
                Submit a Brew
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-md transition-colors shadow-lg"
                >
                  Admin Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium rounded-md transition-colors"
                >
                  Manage Brews
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Top 3 Voted Coffees Section */}
      <section className="py-12 bg-slate-900/30 border-b border-slate-900 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-5 w-5 text-brand-500" />
            <h2 className="text-xl font-extrabold text-white">Top Community Brews</h2>
          </div>
          
          {topBrews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topBrews.map((brew, idx) => (
                <Link
                  key={brew._id}
                  to={`/coffee/${brew._id}`}
                  className="flex items-center gap-4 bg-slate-900 border border-slate-800 hover:border-brand-500/40 p-4 rounded-lg transition-all shadow-md relative group overflow-hidden w-full min-w-0"
                >
                  {/* Position Badge */}
                  <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-brand-500/10 text-brand-400 font-mono text-xs font-bold rounded-bl border-l border-b border-slate-800">
                    #{idx + 1}
                  </div>
                  
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded overflow-hidden bg-slate-950 shrink-0">
                    <img 
                      src={brew.imageUrl || fallbackImage} 
                      alt={brew.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImage;
                      }}
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="min-w-0 pr-6">
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-brand-400 transition-colors">
                      {brew.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-brand-400 font-semibold mt-1">
                      <Star className="h-3 w-3 fill-brand-500 text-brand-500" />
                      <span>{brew.totalVotes || 0} Votes</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-slate-800 rounded-lg py-8 text-center text-slate-500 text-sm">
              No community brews yet.
            </div>
          )}
        </div>
      </section>

      {/* Main Stream Section */}
      <section className="py-12 bg-slate-950 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Search & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Coffee Discovery Stream</h2>
            <p className="text-sm text-slate-400 mt-1">Showing {totalCoffees} active brews</p>
          </div>

          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search coffee varieties..."
              value={search}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 p-4 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-brand-500 animate-spin mb-2" />
            <p className="text-slate-400 text-sm">Loading coffees...</p>
          </div>
        ) : coffees.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-lg p-8 sm:p-12 text-center w-full">
            <Coffee className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300">
              {search.trim() ? 'No brews found matching your search.' : 'No coffees found'}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
              {search.trim() 
                ? 'Try adjusting your search query to find more options.' 
                : "We couldn't find any active coffee listings. Be the first to add one!"}
            </p>
            {!search.trim() && (
              <div className="mt-6">
                <Link
                  to="/create-coffee"
                  className="inline-flex items-center text-sm font-medium text-brand-500 hover:text-brand-400"
                >
                  Create a Coffee Listing <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 w-full">
              {coffees.map((coffee) => (
                <div
                  key={coffee._id}
                  className="flex flex-col bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg overflow-hidden transition-all duration-300 group w-full min-w-0"
                >
                  <div className="h-48 overflow-hidden bg-slate-950 relative">
                    <img
                      src={coffee.imageUrl || fallbackImage}
                      alt={coffee.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImage;
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-2.5 py-1 rounded-full text-xs font-semibold text-brand-400 flex items-center gap-1.5 shadow-md">
                      <Star className="h-3 w-3 fill-brand-500 text-brand-500" />
                      <span>{coffee.totalVotes || 0} Votes</span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 flex flex-col flex-grow min-w-0">
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors truncate">
                      {coffee.name}
                    </h3>
                    <p className="text-slate-400 text-sm mt-2 line-clamp-3 flex-grow break-words">
                      {coffee.description}
                    </p>
                    <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Added {new Date(coffee.createdAt).toLocaleDateString()}
                      </span>
                      <Link
                        to={`/coffee/${coffee._id}`}
                        className="inline-flex items-center text-sm font-semibold text-brand-500 hover:text-brand-400"
                      >
                        Details
                        <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-900">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="p-2 border border-slate-800 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-900 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm font-medium text-slate-300">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-2 border border-slate-800 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-900 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
