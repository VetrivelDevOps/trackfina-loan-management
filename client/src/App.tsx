import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Customers from "./pages/customers/Customers";
import CustomerDetail from "./pages/customers/CustomerDetail";
import CustomerForm from "./pages/customers/CustomerForm";
import Loans from "./pages/loans/Loans";
import LoanDetail from "./pages/loans/LoanDetail";
import Payments from "./pages/payments/Payments";
import Reports from "./pages/reports/Reports";
import Settings from "./pages/settings/Settings";
import GeneralSettings from "./pages/settings/General";
import BranchesSettings from "./pages/settings/Branches";
import UsersSettings from "./pages/settings/Users";
import CompaniesSettings from "./pages/settings/Companies";
import NotFound from "./pages/NotFound";
import { lazy, Suspense } from 'react';

// Lazy load non-critical pages
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const TermsOfService = lazy(() => import('./pages/legal/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const LoanForm = lazy(() => import('./pages/loans/LoanForm'));
const LoanPayment = lazy(() => import('./pages/loans/LoanPayment'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CompanyProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/forgot-password" 
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ForgotPassword />
                </Suspense>
              } 
            />
            <Route 
              path="/terms-of-service" 
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <TermsOfService />
                </Suspense>
              } 
            />
            <Route 
              path="/privacy-policy" 
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <PrivacyPolicy />
                </Suspense>
              } 
            />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            {/* Customer Routes */}
            <Route path="/customers" element={
              <PrivateRoute>
                <Customers />
              </PrivateRoute>
            } />
            <Route path="/customers/new" element={
              <PrivateRoute>
                <CustomerForm />
              </PrivateRoute>
            } />
            <Route path="/customers/:id" element={
              <PrivateRoute>
                <CustomerDetail />
              </PrivateRoute>
            } />
            <Route path="/customers/:id/edit" element={
              <PrivateRoute>
                <CustomerForm />
              </PrivateRoute>
            } />
            
            {/* Loan Routes */}
            <Route path="/loans" element={
              <PrivateRoute>
                <Loans />
              </PrivateRoute>
            } />
            <Route path="/loans/new" element={
              <PrivateRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <LoanForm />
                </Suspense>
              </PrivateRoute>
            } />
            <Route path="/loans/:id" element={
              <PrivateRoute>
                <LoanDetail />
              </PrivateRoute>
            } />
            <Route path="/loans/:id/edit" element={
              <PrivateRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <LoanForm />
                </Suspense>
              </PrivateRoute>
            } />
            <Route path="/loans/:id/payment" element={
              <PrivateRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <LoanPayment />
                </Suspense>
              </PrivateRoute>
            } />
            
            <Route path="/payments" element={
              <PrivateRoute>
                <Payments />
              </PrivateRoute>
            } />
            
            <Route path="/reports" element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            } />
            
            {/* Settings routes with nested routes */}
            <Route path="/settings" element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }>
              <Route index element={<GeneralSettings />} />
              <Route path="general" element={<GeneralSettings />} />
              <Route path="companies" element={<CompaniesSettings />} />
              <Route path="branches" element={<BranchesSettings />} />
              <Route path="users" element={<UsersSettings />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="/not-found" element={<NotFound />} />
            
            {/* Redirect to login by default */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/not-found" />} />
          </Routes>
        </CompanyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
