import { useAuth } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { trpc } from '../../lib/trpc';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();

  const { data: onboardingStatus, isLoading: isCheckingOnboarding, error } =
    trpc.onboarding.status.useQuery(undefined, {
      enabled: isSignedIn && isLoaded,
      retry: false,
    });

  console.log('ProtectedRoute:', { isSignedIn, isLoaded, isCheckingOnboarding, onboardingStatus, error });

  if (!isLoaded || (isSignedIn && isCheckingOnboarding)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-green-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (onboardingStatus?.needsOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (!onboardingStatus?.needsOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/machines" replace />;
  }

  return <>{children}</>;
}
