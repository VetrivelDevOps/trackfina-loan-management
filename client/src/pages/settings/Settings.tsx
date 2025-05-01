import React from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import Layout from '../../components/Layout';

const Settings: React.FC = () => {
  const location = useLocation();
  
  // If we're at exactly /settings, redirect to general
  if (location.pathname === '/settings' || location.pathname === '/settings/') {
    return <Navigate to="/settings/general" replace />;
  }

  const isTabActive = (path: string): boolean => {
    return location.pathname.includes(path);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <div className="border-b">
          <nav className="flex px-6">
            <Link 
              to="/settings/general"
              className={`py-4 px-1 mr-8 border-b-2 font-medium text-sm ${
                isTabActive('/settings/general') 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              General Settings
            </Link>
            <Link 
              to="/settings/companies"
              className={`py-4 px-1 mr-8 border-b-2 font-medium text-sm ${
                isTabActive('/settings/companies') 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Companies
            </Link>
            <Link 
              to="/settings/branches"
              className={`py-4 px-1 mr-8 border-b-2 font-medium text-sm ${
                isTabActive('/settings/branches') 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Branches
            </Link>
            <Link 
              to="/settings/users"
              className={`py-4 px-1 mr-8 border-b-2 font-medium text-sm ${
                isTabActive('/settings/users') 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users & Permissions
            </Link>
          </nav>
        </div>

        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </Layout>
  );
};

export default Settings;