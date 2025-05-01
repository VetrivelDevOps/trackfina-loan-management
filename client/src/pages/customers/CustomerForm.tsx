import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import CustomerService, { CustomerFormData } from '../../services/customer.service';
import { useCompany } from '../../contexts/CompanyContext';

interface Group {
  id: string;
  name: string;
}

const CustomerForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentBranch } = useCompany();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    address: '',
    idProofType: '',
    idProofNumber: '',
    branchId: currentBranch?.id || '',
    groupId: '',
    isActive: true,
  });

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const idProofTypes = ['Aadhaar', 'PAN Card', 'Driving License', 'Voter ID', 'Passport'];

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // In a real app, uncomment this
        // const response = await api.get('/groups');
        // setGroups(response.data);
        
        // Using dummy data for now
        setGroups([
          { id: '1', name: 'Group A' },
          { id: '2', name: 'Group B' },
          { id: '3', name: 'Group C' },
        ]);
      } catch (err: any) {
        console.error('Failed to fetch groups:', err);
      }
    };

    const fetchCustomerData = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        const customerData = await CustomerService.getCustomerById(id!);
        
        setFormData({
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          mobile: customerData.mobile,
          email: customerData.email || '',
          address: customerData.address || '',
          idProofType: customerData.idProofType || '',
          idProofNumber: customerData.idProofNumber || '',
          branchId: customerData.branchId,
          groupId: customerData.groupId || '',
          isActive: customerData.isActive,
        });
        
        setLoading(false);
      } catch (err: any) {
        console.error('Failed to fetch customer:', err);
        setError(err.response?.data?.message || 'Failed to load customer data');
        setLoading(false);
      }
    };

    fetchGroups();
    fetchCustomerData();
  }, [id, isEditMode, currentBranch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isEditMode) {
        await CustomerService.updateCustomer(id!, formData);
        setSubmitting(false);
        navigate(`/customers/${id}`);
      } else {
        const newCustomer = await CustomerService.createCustomer(formData);
        setSubmitting(false);
        navigate(`/customers/${newCustomer.id}`);
      }
    } catch (err: any) {
      console.error('Failed to save customer:', err);
      setError(err.response?.data?.message || 'Failed to save customer');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <Link to={id ? `/customers/${id}` : '/customers'} className="text-blue-600 hover:text-blue-800 flex items-center mb-2">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Customer' : 'Add New Customer'}
          </h1>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="col-span-2">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h2>
                </div>
                
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name*
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                {/* Mobile */}
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                    Mobile Number*
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    id="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                {/* Address */}
                <div className="col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    id="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  ></textarea>
                </div>
                
                {/* ID Proof Information */}
                <div className="col-span-2">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">ID Proof Information</h2>
                </div>
                
                {/* ID Proof Type */}
                <div>
                  <label htmlFor="idProofType" className="block text-sm font-medium text-gray-700">
                    ID Proof Type
                  </label>
                  <select
                    name="idProofType"
                    id="idProofType"
                    value={formData.idProofType}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select ID Type</option>
                    {idProofTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {/* ID Proof Number */}
                <div>
                  <label htmlFor="idProofNumber" className="block text-sm font-medium text-gray-700">
                    ID Proof Number
                  </label>
                  <input
                    type="text"
                    name="idProofNumber"
                    id="idProofNumber"
                    value={formData.idProofNumber}
                    onChange={handleChange}
                    disabled={!formData.idProofType}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                {/* Additional Information */}
                <div className="col-span-2">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Additional Information</h2>
                </div>
                
                {/* Branch */}
                <div>
                  <label htmlFor="branchId" className="block text-sm font-medium text-gray-700">
                    Branch*
                  </label>
                  <input
                    type="text"
                    id="branchName"
                    value={currentBranch?.name || 'Default Branch'}
                    disabled
                    className="mt-1 bg-gray-100 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                  <input type="hidden" name="branchId" value={formData.branchId} />
                </div>
                
                {/* Group */}
                <div>
                  <label htmlFor="groupId" className="block text-sm font-medium text-gray-700">
                    Group
                  </label>
                  <select
                    name="groupId"
                    id="groupId"
                    value={formData.groupId}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Group (Optional)</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Status (for edit mode) */}
                {isEditMode && (
                  <div className="col-span-2">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="isActive"
                          name="isActive"
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={handleChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="isActive" className="font-medium text-gray-700">Active</label>
                        <p className="text-gray-500">Inactive customers won't be able to receive new loans.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-end space-x-3">
                <Link 
                  to={id ? `/customers/${id}` : '/customers'}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>{isEditMode ? 'Update Customer' : 'Create Customer'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerForm;