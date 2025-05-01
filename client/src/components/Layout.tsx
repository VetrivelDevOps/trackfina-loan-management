import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Company selector will be moved here */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Header - CompanySelector removed */}
        <header className="bg-white h-16 shadow-sm flex items-center justify-end px-6">
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold mr-2">
                {user?.firstName?.charAt(0) || 'V'}
              </div>
              <div>
                <span className="text-gray-700">
                  {user?.firstName || 'Vetrivel'} {user?.lastName || 'D'}
                </span>
                <span className="text-xs text-gray-500 block">Company Admin</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1 text-red-600 hover:text-red-700 text-sm"
            >
              Logout
            </button>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;