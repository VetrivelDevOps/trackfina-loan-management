import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '../services/api';

interface Company {
  id: string;
  name: string;
  logo?: string;
}

interface Branch {
  id: string;
  name: string;
  address: string;
  companyId: string;
}

interface CompanyContextType {
  companies: Company[];
  branches: Branch[];
  currentCompany: Company | null;
  currentBranch: Branch | null;
  loading: boolean;
  setCurrentCompany: (company: Company) => void;
  setCurrentBranch: (branch: Branch) => void;
  fetchBranches: (companyId: string) => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

interface CompanyProviderProps {
  children: ReactNode;
}

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        // Replace with actual API call when backend is ready
        // const response = await api.get('/companies');
        // setCompanies(response.data);
        
        // For now, use dummy data
        const dummyCompanies: Company[] = [
          { id: '1', name: 'Finance Plus Inc.', logo: '/logos/finance-plus.png' },
          { id: '2', name: 'Credit Solutions Ltd.', logo: '/logos/credit-solutions.png' },
          { id: '3', name: 'LoanStar Financial', logo: '/logos/loanstar.png' },
        ];
        
        setCompanies(dummyCompanies);
        
        // Set default company if stored in localStorage or use first company
        const savedCompanyId = localStorage.getItem('currentCompanyId');
        if (savedCompanyId) {
          const savedCompany = dummyCompanies.find(c => c.id === savedCompanyId) || dummyCompanies[0];
          setCurrentCompany(savedCompany);
          fetchBranches(savedCompany.id);
        } else if (dummyCompanies.length > 0) {
          setCurrentCompany(dummyCompanies[0]);
          fetchBranches(dummyCompanies[0].id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
        setLoading(false);
      }
    };
    
    fetchCompanies();
  }, []);

  // Fetch branches for a company
  const fetchBranches = async (companyId: string) => {
    try {
      setLoading(true);
      // Replace with actual API call when backend is ready
      // const response = await api.get(`/companies/${companyId}/branches`);
      // setBranches(response.data);
      
      // For now, use dummy data
      const dummyBranches: Branch[] = [
        { id: '1', name: 'Main Office', address: '123 Finance St, New York', companyId: '1' },
        { id: '2', name: 'Downtown Branch', address: '456 Wall St, New York', companyId: '1' },
        { id: '3', name: 'West End', address: '789 Broadway, New York', companyId: '1' },
        { id: '4', name: 'Head Office', address: '101 Credit Ave, Boston', companyId: '2' },
        { id: '5', name: 'South Branch', address: '202 Loan Blvd, Boston', companyId: '2' },
        { id: '6', name: 'Central HQ', address: '303 Star Road, Chicago', companyId: '3' },
      ];
      
      const filteredBranches = dummyBranches.filter(branch => branch.companyId === companyId);
      setBranches(filteredBranches);
      
      // Set default branch if stored in localStorage or use first branch
      const savedBranchId = localStorage.getItem(`currentBranchId_${companyId}`);
      if (savedBranchId) {
        const savedBranch = filteredBranches.find(b => b.id === savedBranchId) || filteredBranches[0];
        setCurrentBranch(savedBranch);
      } else if (filteredBranches.length > 0) {
        setCurrentBranch(filteredBranches[0]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      setLoading(false);
    }
  };

  // Handle company change
  const handleCompanyChange = (company: Company) => {
    setCurrentCompany(company);
    localStorage.setItem('currentCompanyId', company.id);
    fetchBranches(company.id);
  };

  // Handle branch change
  const handleBranchChange = (branch: Branch) => {
    setCurrentBranch(branch);
    if (currentCompany) {
      localStorage.setItem(`currentBranchId_${currentCompany.id}`, branch.id);
    }
  };

  return (
    <CompanyContext.Provider
      value={{
        companies,
        branches,
        currentCompany,
        currentBranch,
        loading,
        setCurrentCompany: handleCompanyChange,
        setCurrentBranch: handleBranchChange,
        fetchBranches,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};