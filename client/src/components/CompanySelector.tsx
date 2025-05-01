import React, { useState } from 'react';
import { useCompany } from '../contexts/CompanyContext';

// Helper function to generate initials from company name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

// Helper to generate a consistent color from a string
const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#4f46e5', '#6366f1', '#8b5cf6', '#a855f7', '#3b82f6', '#0ea5e9', '#14b8a6'];
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Company Logo or Initials component
const CompanyLogoOrInitials: React.FC<{ company: { name: string; logo?: string }, className?: string }> = ({ 
  company, 
  className = "h-5 w-5 rounded-full mr-2" 
}) => {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(company.name);
  const bgColor = stringToColor(company.name);

  if (!company.logo || imageError) {
    return (
      <div 
        className={`flex items-center justify-center text-white font-medium ${className}`}
        style={{ backgroundColor: bgColor }}
      >
        {initials.substring(0, 2)}
      </div>
    );
  }

  return (
    <img 
      src={company.logo} 
      alt={company.name} 
      className={className}
      onError={() => setImageError(true)}
    />
  );
};

const CompanySelector: React.FC = () => {
  const { companies, branches, currentCompany, currentBranch, setCurrentCompany, setCurrentBranch } = useCompany();
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      {/* Company Selector */}
      <div className="relative inline-block text-left">
        <button
          type="button"
          className="inline-flex justify-between items-center w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          onClick={() => {
            setCompanyDropdownOpen(!companyDropdownOpen);
            setBranchDropdownOpen(false);
          }}
        >
          {currentCompany && (
            <CompanyLogoOrInitials company={currentCompany} />
          )}
          <span className="truncate">{currentCompany?.name || 'Select Company'}</span>
          <svg className="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* Company dropdown */}
        {companyDropdownOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {companies.map((company) => (
                <button
                  key={company.id}
                  className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                  onClick={() => {
                    setCurrentCompany(company);
                    setCompanyDropdownOpen(false);
                  }}
                >
                  <CompanyLogoOrInitials company={company} />
                  {company.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Branch Selector */}
      <div className="relative inline-block text-left">
        <button
          type="button"
          className="inline-flex justify-between items-center w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          onClick={() => {
            setBranchDropdownOpen(!branchDropdownOpen);
            setCompanyDropdownOpen(false);
          }}
          disabled={!currentCompany}
        >
          <span className="truncate">{currentBranch?.name || 'Select Branch'}</span>
          <svg className="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* Branch dropdown */}
        {branchDropdownOpen && branches.length > 0 && (
          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => {
                    setCurrentBranch(branch);
                    setBranchDropdownOpen(false);
                  }}
                >
                  {branch.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySelector;