import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';  // Add this line
import { useAuth } from '../contexts/AuthContext';
import { useCompany } from '../contexts/CompanyContext';
import CompanyLogoOrInitials from './CompanyLogoOrInitials'; // assuming we extract this component

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { companies, branches, currentCompany, currentBranch, setCurrentCompany, setCurrentBranch } = useCompany();
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="fixed left-0 top-0 w-64 h-full bg-[#1e3a8a] z-10 flex flex-col">
      {/* App Logo and Name */}
      <div className="h-16 flex items-center px-6 border-b border-blue-900">
        <Link to="/dashboard" className="flex items-center text-xl font-bold text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.06-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93H13v-.93zM13 7h5.24c.25.31.48.65.68 1H13V7zm0 3h6.74c.08.33.15.66.19 1H13v-1zm0 3h6.93c-.06.34-.14.67-.24 1H13v-1zm0 3h6.24c-.2.35-.43.69-.68 1H13v-1zm0 3h3.87c-.87.48-1.84.8-2.87.93V19zm-2 .93v-1.93H9.13c.87.48 1.84.8 2.87.93zM11 17H4.76c.2-.35.43-.69.68-1H11v1zm0-3H4.07c.06-.34.14-.67.24-1H11v1zm0-3H4.26c-.08-.33-.15-.66-.19-1H11v1zm0-3H5.68c-.25-.31-.48-.65-.68-1H11v1zm0-3H7.87c-.87-.48-1.84-.8-2.87-.93V5h6z" />
          </svg>
          TrackFina
        </Link>
      </div>
      
      {/* Company Selector - ADDED HERE */}
      <div className="p-4 border-b border-blue-900">
        <div className="relative">
          <button
            type="button"
            className="w-full bg-blue-800 hover:bg-blue-700 text-white rounded py-2 px-3 flex items-center justify-between"
            onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
          >
            {currentCompany && (
              <div className="flex items-center">
                <div className="flex-shrink-0 h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                  {currentCompany.name.charAt(0)}
                </div>
                <span className="truncate">{currentCompany.name}</span>
              </div>
            )}
            <svg className="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Company dropdown */}
          {companyDropdownOpen && (
            <div className="absolute left-0 w-full mt-1 rounded bg-blue-700 shadow-lg py-1 z-50">
              {companies.map(company => (
                <button
                  key={company.id}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-blue-600 flex items-center"
                  onClick={() => {
                    setCurrentCompany(company);
                    setCompanyDropdownOpen(false);
                  }}
                >
                  <div className="flex-shrink-0 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center text-xs mr-2">
                    {company.name.charAt(0)}
                  </div>
                  <span className="truncate">{company.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Branch Selector */}
        {currentCompany && (
          <div className="relative mt-2">
            <button
              type="button"
              className="w-full bg-blue-800 hover:bg-blue-700 text-white rounded py-2 px-3 flex items-center justify-between"
              onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
            >
              <span className="truncate">{currentBranch?.name || 'Select Branch'}</span>
              <svg className="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Branch dropdown */}
            {branchDropdownOpen && branches.length > 0 && (
              <div className="absolute left-0 w-full mt-1 rounded bg-blue-700 shadow-lg py-1 z-50">
                {branches.map(branch => (
                  <button
                    key={branch.id}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-blue-600"
                    onClick={() => {
                      setCurrentBranch(branch);
                      setBranchDropdownOpen(false);
                    }}
                  >
                    {branch.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* The rest of your sidebar remains the same */}
      <div className="px-4 py-2 text-white text-xs font-semibold tracking-wider opacity-50 mt-6">
        ORGANIZATION
      </div>
      
      <nav className="mt-2 px-2">
        <Link 
          to="/branches" 
          className={`flex items-center px-4 py-2.5 mb-1 text-sm rounded-lg ${
            isActive('/branches') 
              ? 'bg-blue-800 text-white' 
              : 'text-blue-100 hover:bg-blue-800/50'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Branches
        </Link>
        
        <Link 
          to="/groups" 
          className={`flex items-center px-4 py-2.5 mb-1 text-sm rounded-lg ${
            isActive('/groups') 
              ? 'bg-blue-800 text-white' 
              : 'text-blue-100 hover:bg-blue-800/50'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Groups
        </Link>
      </nav>

      <div className="px-4 py-2 text-white text-xs font-semibold tracking-wider opacity-50 mt-6">
        MAIN
      </div>
      
      <nav className="mt-2 px-2">
        <Link 
          to="/dashboard" 
          className={`flex items-center px-4 py-2.5 mb-1 text-sm rounded-lg ${
            isActive('/dashboard') 
              ? 'bg-blue-800 text-white' 
              : 'text-blue-100 hover:bg-blue-800/50'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </Link>

        <Link 
          to="/collections" 
          className={`flex items-center px-4 py-2.5 mb-1 text-sm rounded-lg ${
            isActive('/collections') 
              ? 'bg-blue-800 text-white' 
              : 'text-blue-100 hover:bg-blue-800/50'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Collections
        </Link>
        
        <Link 
          to="/agents" 
          className={`flex items-center px-4 py-2.5 mb-1 text-sm rounded-lg ${
            isActive('/agents') 
              ? 'bg-blue-800 text-white' 
              : 'text-blue-100 hover:bg-blue-800/50'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
          Agents
        </Link>
        
        <Link 
          to="/customers" 
          className={`flex items-center px-4 py-2.5 mb-1 text-sm rounded-lg ${
            isActive('/customers') 
              ? 'bg-blue-800 text-white' 
              : 'text-blue-100 hover:bg-blue-800/50'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Customers
        </Link>
        
        <Link 
          to="/loans" 
          className={`flex items-center px-4 py-2.5 mb-1 text-sm rounded-lg ${
            isActive('/loans') 
              ? 'bg-blue-800 text-white' 
              : 'text-blue-100 hover:bg-blue-800/50'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Loans
        </Link>
        
        <Link 
          to="/partners" 
          className={`flex items-center px-4 py-2.5 mb-1 text-sm rounded-lg ${
            isActive('/partners') 
              ? 'bg-blue-800 text-white' 
              : 'text-blue-100 hover:bg-blue-800/50'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Partners
        </Link>
        
        <Link 
          to="/reports" 
          className={`flex items-center px-4 py-2.5 mb-1 text-sm rounded-lg ${
            isActive('/reports') 
              ? 'bg-blue-800 text-white' 
              : 'text-blue-100 hover:bg-blue-800/50'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Reports
        </Link>
      </nav>

      <div className="px-4 py-2 text-white text-xs font-semibold tracking-wider opacity-50 mt-6">
        SYSTEM
      </div>
      
      <nav className="mt-2 px-2">
        <Link 
          to="/settings" 
          className={`flex items-center px-4 py-2.5 mb-1 text-sm rounded-lg ${
            isActive('/settings') 
              ? 'bg-blue-800 text-white' 
              : 'text-blue-100 hover:bg-blue-800/50'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </Link>
      </nav>

      <div className="mt-auto p-4 bg-[#15307c]">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-indigo-200 text-indigo-800 flex items-center justify-center font-semibold mr-2">
            {user?.firstName?.charAt(0) || 'V'}{user?.lastName?.charAt(0) || 'D'}
          </div>
          <div>
            <div className="text-sm font-medium text-white">
              {user?.firstName || 'Vetrivel'} {user?.lastName || 'D'}
            </div>
            <div className="text-xs text-blue-200">Company Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;