import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import coffeeService from '../services/coffeeService';
import voteService from '../services/voteService';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Coffee, Star, Loader2, User, Calendar, Award, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

const CoffeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [coffee, setCoffee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Voting States
  const [hasVoted, setHasVoted] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [voteError, setVoteError] = useState('');
  const [voteSuccess, setVoteSuccess] = useState('');

  const fallbackImage = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085';

  useEffect(() => {
    const fetchCoffeeDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await coffeeService.getCoffeeById(id);
        if (res.success) {
          setCoffee(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error fetching coffee details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoffeeDetails();
  }, [id]);

  // Check if authenticated user has voted for this coffee
  useEffect(() => {
    const fetchVoteStatus = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await voteService.checkVoteStatus(id);
        if (res.success) {
          setHasVoted(res.hasVoted);
        }
      } catch (err) {
        console.error('Error fetching vote status:', err);
      }
    };

    fetchVoteStatus();
  }, [id, isAuthenticated]);

  const handleVoteSubmit = async () => {
    if (!isAuthenticated) {
      // Redirect unauthenticated users to /login
      navigate('/login');
      return;
    }

    if (coffee?.isOwner) {
      return; // Prevent owner from voting even if clicked
    }

    setVoteLoading(true);
    setVoteError('');
    setVoteSuccess('');

    try {
      const res = await voteService.voteForCoffee(id);
      if (res.success) {
        setHasVoted(true);
        setVoteSuccess('Vote cast successfully!');
        // Update vote count instantly without page refresh
        setCoffee((prev) => ({
          ...prev,
          totalVotes: res.totalVotes !== undefined ? res.totalVotes : (prev.totalVotes + 1)
        }));
      } else {
        setVoteError(res.message || 'Failed to submit vote.');
      }
    } catch (err) {
      setVoteError(err.response?.data?.message || err.message || 'Error casting vote.');
    } finally {
      setVoteLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (window.confirm('Are you sure you want to delete this brew?')) {
      try {
        const res = await coffeeService.deleteCoffee(id);
        if (res.success) {
          alert('Coffee listing successfully deleted.');
          navigate('/');
        } else {
          setError(res.message || 'Failed to delete coffee listing.');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error deleting coffee listing.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin mb-2" />
        <p className="text-slate-400 text-sm">Loading coffee details...</p>
      </div>
    );
  }

  if (error || !coffee) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 w-full">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Back to Listings
          </Link>
        </div>
        <div className="bg-red-950 border border-red-800 text-red-300 p-4 rounded-md text-sm">
          {error || 'Coffee details could not be retrieved.'}
        </div>
      </div>
    );
  }

  const isVoteDisabled = hasVoted || voteLoading || coffee.isOwner;

  let voteButtonText = 'Vote for Brew';
  if (voteLoading) {
    voteButtonText = 'Casting...';
  } else if (coffee.isOwner) {
    voteButtonText = 'Cannot Vote Own Brew';
  } else if (hasVoted) {
    voteButtonText = 'Already Voted';
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full overflow-x-hidden">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden w-full">
        {/* Coffee Image Container */}
        <div className="h-64 sm:h-80 bg-slate-950 flex items-center justify-center border-b border-slate-800 relative w-full">
          <img
            src={coffee.imageUrl || fallbackImage}
            alt={coffee.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
          />

          {/* Owner Badge */}
          {coffee.isOwner && (
            <div className="absolute top-4 left-4 bg-brand-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-md">
              Your Listing
            </div>
          )}
        </div>

        <div className="p-5 sm:p-8 w-full">
          {/* Notification Messages */}
          {voteError && (
            <div className="mb-6 bg-red-950 border border-red-800 text-red-300 p-3 rounded text-sm flex items-center gap-2 w-full">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="break-words">{voteError}</span>
            </div>
          )}
          {voteSuccess && (
            <div className="mb-6 bg-emerald-950 border border-emerald-800 text-emerald-300 p-3 rounded text-sm flex items-center gap-2 w-full">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span className="break-words">{voteSuccess}</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 w-full">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white break-words">{coffee.name}</h1>
              
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-xs sm:text-sm text-slate-400">
                <span className="flex items-center gap-1.5 truncate">
                  <User className="h-4 w-4 text-slate-500 shrink-0" />
                  Submitted by {coffee.createdBy?.name || 'Unknown'}
                </span>
                <span className="flex items-center gap-1.5 shrink-0">
                  <Calendar className="h-4 w-4 text-slate-500 shrink-0" />
                  {new Date(coffee.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="flex items-center bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg justify-between sm:justify-start">
                <Star className="h-5 w-5 text-brand-500 fill-brand-500 mr-2 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Community Votes</div>
                  <div className="text-lg sm:text-xl font-extrabold text-white mt-0.5">{coffee.totalVotes || 0}</div>
                </div>
              </div>

              {/* Vote Button */}
              <button
                onClick={handleVoteSubmit}
                disabled={isVoteDisabled}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all shadow-md min-w-[140px] ${
                  isVoteDisabled 
                    ? 'bg-slate-850 border border-slate-800 text-slate-500 cursor-default' 
                    : 'bg-brand-500 hover:bg-brand-600 text-white cursor-pointer active:scale-[0.98]'
                }`}
              >
                {voteLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                ) : (
                  <Award className={`h-4 w-4 shrink-0 ${isVoteDisabled ? 'text-slate-600' : 'text-white'}`} />
                )}
                <span>{voteButtonText}</span>
              </button>

              {/* Delete Button (Admin Only) */}
              {user?.role === 'admin' && (
                <button
                  onClick={handleDeleteSubmit}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all shadow-md bg-red-600 hover:bg-red-700 text-white cursor-pointer active:scale-[0.98]"
                >
                  <Trash2 className="h-4 w-4 shrink-0" />
                  <span>Delete Brew</span>
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 w-full">
            <h2 className="text-lg font-bold text-white mb-3">Description</h2>
            <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line break-words">
              {coffee.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeDetails;
