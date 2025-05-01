import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import LoanService, { Loan, LoanStatus, LoanPayment } from '../../services/loan.service';

interface LoanScheduleItem {
  paymentNumber: number;
  paymentDate: string;
  scheduledAmount: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  status: 'PAID' | 'UPCOMING' | 'MISSED' | 'PARTIAL';
  actualPaymentAmount?: number;
  actualPaymentDate?: string;
}

const LoanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [payments, setPayments] = useState<LoanPayment[]>([]);
  const [schedule, setSchedule] = useState<LoanScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'payments' | 'schedule'>('details');

  useEffect(() => {
    const fetchLoanData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const loanData = await LoanService.getLoan(id);
        setLoan(loanData);
        
        const paymentsData = await LoanService.getLoanPayments(id);
        setPayments(paymentsData);
        
        const scheduleData = await LoanService.getLoanSchedule(id);
        setSchedule(scheduleData);
      } catch (error) {
        console.error('Error fetching loan details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanData();
  }, [id]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge color based on loan status
  const getStatusBadgeClass = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case LoanStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case LoanStatus.APPROVED:
        return 'bg-blue-100 text-blue-800';
      case LoanStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      case LoanStatus.DEFAULTED:
        return 'bg-red-100 text-red-800';
      case LoanStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (newStatus: LoanStatus) => {
    if (!id) return;
    
    try {
      const updatedLoan = await LoanService.changeLoanStatus(id, newStatus);
      setLoan(updatedLoan);
    } catch (error) {
      console.error('Error updating loan status:', error);
    }
  };

  const handleMakePayment = () => {
    if (id) {
      navigate(`/loans/${id}/payment`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!loan) {
    return (
      <Layout>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-700">Loan not found</h2>
          <button 
            onClick={() => navigate('/loans')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Loans
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">
            Loan Details: {loan.id}
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/loans')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Loans
            </button>
            {loan.status === LoanStatus.PENDING && (
              <>
                <button
                  onClick={() => handleStatusChange(LoanStatus.APPROVED)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Approve Loan
                </button>
                <button
                  onClick={() => handleStatusChange(LoanStatus.REJECTED)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Reject Loan
                </button>
              </>
            )}
            {loan.status === LoanStatus.APPROVED && (
              <button
                onClick={() => handleStatusChange(LoanStatus.ACTIVE)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Activate Loan
              </button>
            )}
            {loan.status === LoanStatus.ACTIVE && (
              <button
                onClick={handleMakePayment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Record Payment
              </button>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(loan.status)}`}>
            {loan.status}
          </span>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Loan Details
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payments' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Payment History
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'schedule' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Repayment Schedule
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer Name</p>
                    <p className="mt-1 text-sm text-gray-900">{loan.customerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer ID</p>
                    <p className="mt-1 text-sm text-gray-900">{loan.customerId}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Loan Type</p>
                    <p className="mt-1 text-sm text-gray-900">{loan.loanType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Principal Amount</p>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(loan.principalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Interest Rate</p>
                    <p className="mt-1 text-sm text-gray-900">{loan.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Term</p>
                    <p className="mt-1 text-sm text-gray-900">{loan.term} months</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Important Dates</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Start Date</p>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(loan.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">End Date</p>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(loan.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Next Payment Date</p>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(loan.nextPaymentDate)}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Next Payment Amount</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {loan.nextPaymentAmount ? formatCurrency(loan.nextPaymentAmount) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Remaining Balance</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {loan.remainingBalance ? formatCurrency(loan.remainingBalance) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Interest</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {loan.totalInterest ? formatCurrency(loan.totalInterest) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              {loan.collateral && (
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Collateral</h3>
                  <p className="text-sm text-gray-700">{loan.collateral}</p>
                </div>
              )}
              {loan.notes && (
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm text-gray-700">{loan.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
                <button
                  onClick={handleMakePayment}
                  disabled={loan.status !== LoanStatus.ACTIVE}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    loan.status === LoanStatus.ACTIVE
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Record Payment
                </button>
              </div>

              {payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(payment.paymentDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.paymentMethod}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {payment.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No payment records found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Repayment Schedule</h3>
              
              {schedule.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Principal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Interest
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Remaining Balance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {schedule.map((item) => {
                        const getStatusClass = () => {
                          switch (item.status) {
                            case 'PAID': return 'bg-green-100 text-green-800';
                            case 'PARTIAL': return 'bg-yellow-100 text-yellow-800';
                            case 'MISSED': return 'bg-red-100 text-red-800';
                            default: return 'bg-gray-100 text-gray-800';
                          }
                        };

                        return (
                          <tr key={item.paymentNumber}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.paymentNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(item.paymentDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(item.scheduledAmount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(item.principal)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(item.interest)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(item.remainingBalance)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass()}`}>
                                {item.status}
                              </span>
                              {item.status === 'PAID' && item.actualPaymentDate && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Paid on {formatDate(item.actualPaymentDate)}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No schedule available.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LoanDetail;