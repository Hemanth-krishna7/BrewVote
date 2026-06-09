import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import coffeeService from '../services/coffeeService';
import { ArrowLeft, Coffee, Info, Image, Plus, AlertCircle } from 'lucide-react';

const CreateCoffee = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !imageUrl.trim()) {
      return setError('Please fill in all fields.');
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await coffeeService.createCoffee({
        name: name.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim()
      });

      if (res.success) {
        navigate('/');
      } else {
        throw new Error(res.message || 'Failed to submit coffee listing.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error occurred while creating coffee.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-brand-950 rounded-lg">
            <Plus className="h-6 w-6 text-brand-500" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Submit a New Brew</h1>
            <p className="text-sm text-slate-400 mt-1">Share your favorite coffee variety with the community</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-950 border border-red-800 text-red-300 p-3 rounded text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300">
              Coffee Name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Coffee className="h-4 w-4 text-slate-500" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                placeholder="Ethiopian Yirgacheffe, Colombia Supremo..."
              />
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-300">
              Image URL
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Image className="h-4 w-4 text-slate-500" />
              </div>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300">
              Description
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                <Info className="h-4 w-4 text-slate-500" />
              </div>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                placeholder="Describe the flavor notes, roast type, origin process details..."
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Submitting brew...' : 'Submit Coffee Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCoffee;
