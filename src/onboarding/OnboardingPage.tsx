import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { Logo } from '@shared/ui/components/Logo';

export function OnboardingPage() {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
          <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Welcome to the Rooted App
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-center">
            Let's set up your farm
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="farmName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Farm Name
              </label>
              <input
                id="farmName"
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="Enter your farm name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={createMutation.isPending}
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={createMutation.isPending || !farmName.trim()}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Farm'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
