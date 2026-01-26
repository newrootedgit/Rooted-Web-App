import { SignedIn, SignedOut, RedirectToSignIn, useUser, useAuth } from '@clerk/clerk-react';
import { TRPCProvider } from '../lib/trpc';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const isAdmin = user?.publicMetadata?.isAdmin;

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        {isAdmin ? (
          <TRPCProvider getAuthToken={getToken}>
            <Dashboard />
          </TRPCProvider>
        ) : (
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
              <p className="text-gray-600">
                You do not have admin privileges to access this portal.
              </p>
            </div>
          </div>
        )}
      </SignedIn>
    </>
  );
}
