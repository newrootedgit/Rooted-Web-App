import { SignIn, SignUp } from '@clerk/clerk-react';
import { useState } from 'react';
import { Logo } from '@shared/ui/components/Logo';

type AuthView = 'sign-in' | 'sign-up';

export function AuthPage() {
  const [view, setView] = useState<AuthView>('sign-in');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">
            Welcome to Rooted
          </h1>
          <p className="mt-2 text-gray-600 text-center">
            {view === 'sign-in'
              ? 'Sign in to manage your farm operations'
              : 'Create an account to get started'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {view === 'sign-in' ? (
            <SignIn
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none p-0',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton:
                    'border border-gray-300 hover:bg-gray-50',
                  formButtonPrimary:
                    'bg-green-600 hover:bg-green-700 text-white',
                  footerActionLink: 'text-green-600 hover:text-green-700',
                },
              }}
              routing="hash"
            />
          ) : (
            <SignUp
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none p-0',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton:
                    'border border-gray-300 hover:bg-gray-50',
                  formButtonPrimary:
                    'bg-green-600 hover:bg-green-700 text-white',
                  footerActionLink: 'text-green-600 hover:text-green-700',
                },
              }}
              routing="hash"
            />
          )}
        </div>

        <div className="mt-6 text-center">
          {view === 'sign-in' ? (
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setView('sign-up')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => setView('sign-in')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
