import React, { useState, useEffect } from 'react';
import { useCompany } from '../../contexts/CompanyContext';

// Define a simple Company interface (similar to Branch)
interface Company {
  id: string;
  name: string;
  logo?: string;
  branchCount: number;
}

// Create dummy data - this avoids any context issues for now
const dummyCompanies: Company[] = [
  { 
    id: '1', 
    name: 'Finance Plus Inc.', 
    logo: 'https://via.placeholder.com/40/4f46e5/ffffff?text=FP', // Fallback placeholder
    branchCount: 3 
  },
  { 
    id: '2', 
    name: 'Credit Solutions Ltd.', 
    logo: 'https://via.placeholder.com/40/6366f1/ffffff?text=CS', // Fallback placeholder
    branchCount: 3 
  },
  { 
    id: '3', 
    name: 'LoanStar Financial', 
    logo: 'https://via.placeholder.com/40/8b5cf6/ffffff?text=LF', // Fallback placeholder
    branchCount: 3 
  },
];

const CompaniesSettings: React.FC = () => {
  const { companies: contextCompanies } = useCompany();
  const [companies, setCompanies] = useState<Company[]>(dummyCompanies);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', logo: '' });
  
  // Use the companies from context when available
  useEffect(() => {
    if (contextCompanies && contextCompanies.length) {
      setCompanies(contextCompanies);
    }
  }, [contextCompanies]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCompany(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add company:', newCompany);
    setShowAddModal(false);
    setNewCompany({ name: '', logo: '' });
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Company Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Company
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branches
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company) => (
              <tr key={company.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {company.logo ? (
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          src={company.logo} 
                          alt={company.name} 
                          className="h-10 w-10 rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const initials = company.name.split(' ').map(n => n[0]).join('');
                            target.parentElement!.innerHTML = `<div class="flex items-center justify-center bg-blue-600 text-white font-medium rounded-full h-10 w-10">${initials}</div>`;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="flex items-center justify-center bg-blue-600 text-white font-medium rounded-full h-10 w-10">
                          {company.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{company.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {company.branchCount} branches
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setShowAddModal(false)}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Company</h3>
              <form className="mt-2 text-left" onSubmit={handleAddCompany}>
                <div className="mt-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={newCompany.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mt-4">
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700">Logo URL</label>
                  <input
                    type="text"
                    name="logo"
                    id="logo"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={newCompany.logo}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Company
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompaniesSettings;