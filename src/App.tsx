import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { MachinesPage } from '@machines/MachinesPage';
import { PlannerPage } from '@planner/PlannerPage';
import { AuthPage, ProtectedRoute } from '@auth/index';
import { TRPCProvider } from './lib/trpc';

function RootRedirect() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return <Navigate to={isSignedIn ? '/machines' : '/auth'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/machines"
        element={
          <ProtectedRoute>
            <MachinesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/planner"
        element={
          <ProtectedRoute>
            <PlannerPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  const { getToken } = useAuth();

  return (
    <TRPCProvider getAuthToken={getToken}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TRPCProvider>
  );
}

export default App;
