import { useState, useEffect } from 'react';
import { useCompany } from '../../contexts/CompanyContext';

interface Branch {
  id: string;
  name: string;
  address: string;
  companyId: string;
}

const BranchesSettings = () => {
  const { companies, currentCompany } = useCompany();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: '', address: '', companyId: currentCompany?.id || '' });
  
  useEffect(() => {
    // Fetch branches (dummy data for now)
    const dummyBranches: Branch[] = [
      { id: '1', name: 'Main Office', address: '123 Finance St, New York', companyId: '1' },
      { id: '2', name: 'Downtown Branch', address: '456 Wall St, New York', companyId: '1' },
      { id: '3', name: 'West End', address: '789 Broadway, New York', companyId: '1' },
      { id: '4', name: 'Head Office', address: '101 Credit Ave, Boston', companyId: '2' },
      { id: '5', name: 'South Branch', address: '202 Loan Blvd, Boston', companyId: '2' },
      { id: '6', name: 'Central HQ', address: '303 Star Road, Chicago', companyId: '3' },
    ];
    
    setBranches(dummyBranches);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement add branch functionality
    console.log('Add branch:', newBranch);
    setShowAddModal(false);
    setNewBranch({ name: '', address: '', companyId: currentCompany?.id || '' });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Branch Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Branch
        </button>
      </div>
      
      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branch Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {branches.map((branch) => (
              <tr key={branch.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{branch.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{branch.address}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {companies.find(c => c.id === branch.companyId)?.name}
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
      
      {/* Add Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setShowAddModal(false)}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Branch</h3>
              <form className="mt-2 text-left" onSubmit={handleSubmit}>
                <div className="mt-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Branch Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="mt-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={newBranch.address}
                    onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                    required
                  />
                </div>
                
                <div className="mt-4">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                  <select
                    id="company"
                    name="company"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newBranch.companyId}
                    onChange={(e) => setNewBranch({ ...newBranch, companyId: e.target.value })}
                    required
                  >
                    <option value="">Select a company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
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
                    Add Branch
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchesSettings;