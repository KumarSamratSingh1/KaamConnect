import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { getMe } from './store/slices/authSlice';

// Pages
import LandingPage from './pages/shared/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CustomerDashboard from './pages/customer/Dashboard';
import SearchPage from './pages/customer/SearchPage';
import WorkerProfilePage from './pages/shared/WorkerProfilePage';
import BookingPage from './pages/customer/BookingPage';
import CustomerBookings from './pages/customer/CustomerBookings';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import WorkerOnboarding from './pages/worker/WorkerOnboarding';
import WorkerBookings from './pages/worker/WorkerBookings';
import ChatPage from './pages/shared/ChatPage';
import PaymentPage from './pages/customer/PaymentPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBookings from './pages/admin/AdminBookings';
import AdminVerifications from './pages/admin/AdminVerifications';
import NotFound from './pages/shared/NotFound';
import LoadingScreen from './components/common/LoadingScreen';
import ErrorBoundary from './components/common/ErrorBoundary';

// Route Guards
const ProtectedRoute = ({ children, roles }) => {
  const { user, initialized } = useSelector(s => s.auth);
  if (!initialized) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, initialized } = useSelector(s => s.auth);
  if (!initialized) return <LoadingScreen />;
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'worker') return <Navigate to="/worker/dashboard" replace />;
    return <Navigate to="/customer/dashboard" replace />;
  }
  return children;
};

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { initialized } = useSelector(s => s.auth);
  const { darkMode } = useSelector(s => s.ui);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) dispatch(getMe());
    else dispatch({ type: 'auth/getMe/rejected' });
  }, [dispatch]);

  if (!initialized) return <LoadingScreen />;
  return children;
};

function AppRoutes() {
  return (
    <AppInitializer>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/workers/:id" element={<WorkerProfilePage />} />

        {/* Customer */}
        <Route path="/customer/dashboard" element={<ProtectedRoute roles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute roles={['customer']}><SearchPage /></ProtectedRoute>} />
        <Route path="/book/:workerId" element={<ProtectedRoute roles={['customer']}><BookingPage /></ProtectedRoute>} />
        <Route path="/customer/bookings" element={<ProtectedRoute roles={['customer']}><CustomerBookings /></ProtectedRoute>} />
        <Route path="/payment/:bookingId" element={<ProtectedRoute roles={['customer']}><PaymentPage /></ProtectedRoute>} />

        {/* Worker */}
        <Route path="/worker/dashboard" element={<ProtectedRoute roles={['worker']}><WorkerDashboard /></ProtectedRoute>} />
        <Route path="/worker/onboarding" element={<ProtectedRoute roles={['worker']}><WorkerOnboarding /></ProtectedRoute>} />
        <Route path="/worker/bookings" element={<ProtectedRoute roles={['worker']}><WorkerBookings /></ProtectedRoute>} />

        {/* Shared */}
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/chat/:conversationId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute roles={['admin']}><AdminBookings /></ProtectedRoute>} />
        <Route path="/admin/verifications" element={<ProtectedRoute roles={['admin']}><AdminVerifications /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppInitializer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '12px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px' },
              success: { iconTheme: { primary: '#059669', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  );
}
