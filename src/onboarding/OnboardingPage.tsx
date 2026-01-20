import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';

export function OnboardingPage() {
  const navigate = useNavigate();
  const [farmName, setFarmName] = useState('');
  const [error, setError] = useState('');

  const createMutation = trpc.onboarding.createTenantAndFarm.useMutation({
    onSuccess: () => {
      window.location.href = '/machines';
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (farmName.trim().length < 2) {
      setError('Farm name must be at least 2 characters');
      return;
    }

    createMutation.mutate({ farmName: farmName.trim() });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Rooted</h1>
          <p className="text-gray-600">Let's set up your farm</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="farmName" className="block text-sm font-medium text-gray-700 mb-2">
              Farm Name
            </label>
            <input
              id="farmName"
              type="text"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder="Enter your farm name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={createMutation.isPending}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={createMutation.isPending || !farmName.trim()}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Farm'}
          </button>
        </form>
      </div>
    </div>
  );
}
