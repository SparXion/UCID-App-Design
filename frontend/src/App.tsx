import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './apps/landing/LandingPage';
import { UCIDApp } from './apps/ucid/UCIDApp';
import { AdminAnalytics } from './apps/ucid/AdminAnalytics';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import { ProtectedRoute } from './components/ProtectedRoute';
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
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

