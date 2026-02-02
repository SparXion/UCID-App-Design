import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './apps/landing/LandingPage';
import { UCIDApp } from './apps/ucid/UCIDApp';
import { AdminAnalytics } from './apps/ucid/AdminAnalytics';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/ucid"
            element={
              <ProtectedRoute>
                <UCIDApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ucid/*"
            element={
              <ProtectedRoute>
                <UCIDApp />
              </ProtectedRoute>
            }
          />
          {/* Direct admin access for john.mark.violette@icloud.com */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminAnalytics />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminRoute>
                <AdminAnalytics />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

