import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/registration/login';
import Home from './pages/home/home';
import CustomerDashboard from './pages/customer/customerDashboard';
import AgentDashboard from './pages/agent/agentDashboard';
import AdminDashboard from './pages/admin/adminDashBoard';
import SignUpPage from './pages/registration/signup';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/agent" element={<AgentDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
