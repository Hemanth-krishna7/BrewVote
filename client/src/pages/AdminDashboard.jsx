import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import coffeeService from '../services/coffeeService';
import adminService from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Plus, Trash2, Edit3, Coffee, Vote, Award, Users,
  ChevronLeft, ChevronRight, Loader2, X, AlertCircle, CheckCircle 
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [coffees, setCoffees] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCoffees, setTotalCoffees] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Dashboard Stats State
  const [stats, setStats] = useState(null);

  // Edit State
  const [editingCoffee, setEditingCoffee] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editError, setEditError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await adminService.getStats();
      if (data.success) {
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchCoffees = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await coffeeService.getAllCoffees('', page, 8); // Limit to 8 entries
      if (data.success) {
        setCoffees(data.coffees);
        setTotalPages(data.pagination.pages || 1);
        setTotalCoffees(data.pagination.total);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching coffee list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoffees();
    fetchStats();
  }, [page]);

  const handleDeactivate = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate (soft-delete) this coffee listing?')) {
      return;
    }
    setError('');
    setSuccessMsg('');
    try {
      const res = await coffeeService.deleteCoffee(id);
      if (res.success) {
        setSuccessMsg('Coffee listing deactivated successfully.');
        fetchCoffees();
        fetchStats();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error deactivating listing.');
    }
  };

  const openEditModal = (coffee) => {
    setEditingCoffee(coffee);
    setEditName(coffee.name);
    setEditDescription(coffee.description);
    setEditImageUrl(coffee.imageUrl);
    setEditError('');
  };

  const closeEditModal = () => {
    setEditingCoffee(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editDescription.trim() || !editImageUrl.trim()) {
      return setEditError('Please fill in all fields.');
    }

    setIsUpdating(true);
    setEditError('');
    try {
      const res = await coffeeService.updateCoffee(editingCoffee._id, {
        name: editName.trim(),
        description: editDescription.trim(),
        imageUrl: editImageUrl.trim()
      });

      if (res.success) {
        setSuccessMsg('Coffee listing updated successfully.');
        closeEditModal();
        fetchCoffees();
        fetchStats();
      }
    } catch (err) {
      setEditError(err.response?.data?.message || err.message || 'Error updating listing.');
    } finally {
      setIsUpdating(false);
    }
  };

  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-brand-500" />
            Admin Dashboard
          </h1>
          <p className="text-slate-400 mt-1">
            Manage coffee profiles, monitor voting activity, and view metrics.
          </p>
          {user && (
            <div className="mt-3 text-sm">
              <p className="text-emerald-400 font-semibold">Logged in as Administrator</p>
              <p className="text-slate-400 text-xs mt-0.5">{user.email}</p>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <Link
            to="/create-coffee"
            className="inline-flex items-center gap-2 px-4 py-2 border border-transparent bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-md transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Coffee
          </Link>
        </div>
      </div>

      {/* Status Alert Banners */}
      {error && (
        <div className="bg-red-950 border border-red-800 text-red-300 p-4 rounded-md text-sm mb-6 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 p-4 rounded-md text-sm mb-6 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Metrics Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-400">Total Users</span>
            <Users className="h-5 w-5 text-slate-500" />
          </div>
          <div className="text-3xl font-bold text-white">{stats ? stats.totalUsers : '--'}</div>
          <p className="text-xs text-slate-500 mt-2">Registered accounts</p>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-400">Total Coffees</span>
            <Coffee className="h-5 w-5 text-slate-500" />
          </div>
          <div className="text-3xl font-bold text-white">{stats ? stats.totalCoffees : '--'}</div>
          <p className="text-xs text-slate-500 mt-2">Active in catalog</p>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-400">Total Votes Cast</span>
            <Vote className="h-5 w-5 text-slate-500" />
          </div>
          <div className="text-3xl font-bold text-white">{stats ? stats.totalVotes : '--'}</div>
          <p className="text-xs text-slate-500 mt-2">All time votes logged</p>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-400">Top Brew (All Time)</span>
            <Award className="h-5 w-5 text-slate-500" />
          </div>
          <div className="text-lg font-bold text-brand-400 truncate">
            {stats?.mostVotedCoffee 
              ? `${stats.mostVotedCoffee.name} (${stats.mostVotedCoffee.totalVotes} votes)` 
              : 'None'}
          </div>
          <p className="text-xs text-slate-500 mt-2">Most voted active coffee</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 columns - Coffee Management Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white">Manage Coffee Listings</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-brand-500 animate-spin mb-2" />
              <p className="text-slate-400 text-sm">Loading listings...</p>
            </div>
          ) : coffees.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Coffee className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm">No coffee listings to display.</p>
              <p className="text-xs text-slate-600 mt-1 font-mono">Status: empty</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-medium">
                    <th className="p-4">Coffee Name</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4 text-center">Votes</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {coffees.map((coffee) => (
                    <tr key={coffee._id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-semibold text-white">{coffee.name}</td>
                      <td className="p-4 font-mono text-xs text-slate-400">{coffee.slug}</td>
                      <td className="p-4 text-center text-brand-400 font-bold">{coffee.totalVotes || 0}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(coffee)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded transition-colors"
                        >
                          <Edit3 className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeactivate(coffee._id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-900 bg-red-950/45 hover:bg-red-950 text-red-400 text-xs font-semibold rounded transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                          Deactivate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-900/50">
                  <span className="text-xs text-slate-400">
                    Showing Page {page} of {totalPages} ({totalCoffees} items total)
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="p-1 border border-slate-800 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                      className="p-1 border border-slate-800 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column - Status Info */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">System Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Database Connection</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-900">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">API Gateway</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-900">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Node Environment</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-400 font-mono">
                  development
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Coffee Modal */}
      {editingCoffee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={closeEditModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Coffee className="h-5 w-5 text-brand-500" />
              Edit Coffee Listing
            </h3>

            {editError && (
              <div className="mb-4 bg-red-950 border border-red-800 text-red-300 p-2.5 rounded text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-brand-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-brand-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-brand-500 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 text-sm font-medium rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
