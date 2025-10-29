
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute'; 
import Navbar from './components/Navbar'; 
import DashboardLayout from './layouts/DashboardLayout';

import LoginPage from './pages/Auth/LoginPage'; 
import RegisterPage from './pages/Auth/RegisterPage'; 


import HomePage from './pages/HomePage'; 
import TransferPage from './pages/TransferPage'; 
import DepositWithdrawPage from './pages/DepositWithdrawPage'; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/transfer" element={<TransferPage />} />
              <Route path="/deposit-withdraw" element={<DepositWithdrawPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;