import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoanService, { Loan, LoanFormData, LoanType } from '../../services/loan.service';
import CustomerService, { Customer } from '../../services/customer.service';
import Layout from '../../components/Layout';
import { useCompany } from '../../contexts/CompanyContext';

const LoanForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentBranch } = useCompany();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<LoanFormData>({
    customerId: '',
    principalAmount: 0,
    interestRate: 0,
    term: 12,
    loanType: LoanType.PERSONAL,
    startDate: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerLoading, setCustomerLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setCustomerLoading(true);
        const data = await CustomerService.getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setCustomerLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchLoanData = async () => {
      if (isEditing && id) {
        try {
          setLoading(true);
          const loan = await LoanService.getLoan(id);
          
          // Convert the loan data to form data
          setFormData({
            customerId: loan.customerId,
            principalAmount: loan.principalAmount,
            interestRate: loan.interestRate,
            term: loan.term,
            loanType: loan.loanType,
            startDate: loan.startDate || new Date().toISOString().split('T')[0],
            collateral: loan.collateral || '',
            notes: loan.notes || '',
          });
        } catch (error) {
          console.error('Error fetching loan:', error);
          setError('Failed to load loan data. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLoanData();
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Convert numeric string values to numbers for number inputs
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : parseFloat(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Validate form
      if (!formData.customerId) {
        setError('Please select a customer');
        setSubmitting(false);
        return;
      }
      
      if (formData.principalAmount <= 0) {
        setError('Loan amount must be greater than zero');
        setSubmitting(false);
        return;
      }
      
      if (formData.interestRate <= 0) {
        setError('Interest rate must be greater than zero');
        setSubmitting(false);
        return;
      }
      
      if (formData.term <= 0) {
        setError('Loan term must be greater than zero');
        setSubmitting(false);
        return;
      }

      if (isEditing && id) {
        await LoanService.updateLoan(id, formData);
      } else {
        await LoanService.createLoan(formData);
      }
      
      navigate('/loans');
    } catch (error: any) {
      console.error('Error submitting loan:', error);
      setError(error.response?.data?.message || 'Failed to save loan. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {isEditing ? 'Edit Loan' : 'Create New Loan'}
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={() => navigate('/loans')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Loan Details</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the details for this loan.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
                    Customer *
                  </label>
                  <div className="mt-1">
                    <select
                      id="customerId"
                      name="customerId"
                      value={formData.customerId}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Select a customer</option>
                      {customerLoading ? (
                        <option disabled>Loading customers...</option>
                      ) : (
                        customers.map(customer => (
                          <option key={customer.id} value={customer.id}>
                            {customer.firstName} {customer.lastName} ({customer.email})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="loanType" className="block text-sm font-medium text-gray-700">
                    Loan Type *
                  </label>
                  <div className="mt-1">
                    <select
                      id="loanType"
                      name="loanType"
                      value={formData.loanType}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      {Object.values(LoanType).map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="principalAmount" className="block text-sm font-medium text-gray-700">
                    Loan Amount (₹) *
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="principalAmount"
                      id="principalAmount"
                      value={formData.principalAmount}
                      onChange={handleChange}
                      min="0"
                      step="1000"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="term" className="block text-sm font-medium text-gray-700">
                    Term (Months) *
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="term"
                      id="term"
                      value={formData.term}
                      onChange={handleChange}
                      min="1"
                      max="240"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
                    Interest Rate (% p.a.) *
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="interestRate"
                      id="interestRate"
                      value={formData.interestRate}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="collateral" className="block text-sm font-medium text-gray-700">
                    Collateral
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="collateral"
                      id="collateral"
                      value={formData.collateral || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Enter any assets used as collateral for this loan.
                  </p>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formData.notes || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Add any additional notes or conditions for this loan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/loans')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default LoanForm;