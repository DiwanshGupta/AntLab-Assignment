import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/registration/login';
import Home from './pages/home/home';
import CustomerDashboard from './pages/customer/customerDashboard';
import AgentDashboard from './pages/agent/agentDashboard';
import AdminDashboard from './pages/admin/adminDashBoard';
import SignUpPage from './pages/registration/signup';
import ProfileManagement from './pages/admin/profileManagement';

// Utility function to get the current user role from token or local storage
const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
    return decodedToken?.role || null;
  } catch (error) {
    return null;
  }
};

// PrivateRoute component for route protection
const PrivateRoute = ({ children, allowedRoles }) => {
  const userRole = getUserRole();

  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Routes accessible by Customer */}
        <Route path="/customer" element={<CustomerDashboard />} />

        {/* Protect Admin and Agent routes */}
        <Route
          path="/agent"
          element={
            <PrivateRoute allowedRoles={['admin', 'agent']}>
              <AgentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <ProfileManagement />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
