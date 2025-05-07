import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VideoPage from './pages/VideoPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function App ()
{
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
      {/* Basic Navbar or Header could go here */ }
      <Routes>
        <Route path="/login" element={ isAuthenticated ? <Navigate to="/video" /> : <LoginPage /> } />
        <Route path="/register" element={ isAuthenticated ? <Navigate to="/video" /> : <RegisterPage /> } />
        <Route
          path="/video"
          element={
            <ProtectedRoute>
              <VideoPage />
            </ProtectedRoute>
          }
        />
        {/* Redirect root path - e.g., to login if not authenticated, or video if authenticated */ }
        <Route path="/" element={ <Navigate to={ isAuthenticated ? "/video" : "/login" } /> } />
        {/* Add a 404 Not Found route if desired */ }
        <Route path="*" element={ <Navigate to="/" /> } />
      </Routes>
    </div>
  );
}

export default App;

