import { useEffect, useState } from 'react';
import { useCompany } from '../contexts/CompanyContext';
import Layout from '../components/Layout';
import api from '../services/api';

interface DashboardStats {
  totalLoans: number;
  activeLoans: number;
  totalDisbursed: number;
  totalCollected: number;
  overdue: number;
}

const Dashboard = () => {
  const { currentCompany, currentBranch } = useCompany();
  const [stats, setStats] = useState<DashboardStats>({
    totalLoans: 0,
    activeLoans: 0,
    totalDisbursed: 0,
    totalCollected: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats based on selected company and branch
    const fetchDashboardData = async () => {
      if (!currentCompany || !currentBranch) return;
      
      try {
        setLoading(true);
        // Replace with actual API call when backend is ready
        // const response = await api.get('/dashboard/stats');
        // setStats(response.data);
        
        // For now, use dummy data
        setTimeout(() => {
          setStats({
            totalLoans: 124,
            activeLoans: 87,
            totalDisbursed: 1250000,
            totalCollected: 450000,
            overdue: 12,
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentCompany, currentBranch]); // Re-fetch when company or branch changes

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        {currentCompany && currentBranch && (
          <p className="text-gray-600">
            {currentCompany.name} - {currentBranch.name}
          </p>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-gray-500 text-sm font-medium mb-1">Total Loans</h2>
              <p className="text-3xl font-bold text-gray-900">{stats.totalLoans}</p>
              <p className="text-green-600 text-sm mt-2">
                <span>{stats.activeLoans} active</span>
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-gray-500 text-sm font-medium mb-1">Total Disbursed</h2>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalDisbursed)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-gray-500 text-sm font-medium mb-1">Total Collected</h2>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalCollected)}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r">
                <p className="font-medium">New loan disbursed</p>
                <p className="text-sm text-gray-600">Customer: John Doe, Amount: ₹25,000</p>
                <p className="text-xs text-gray-400">Today, 10:30 AM</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r">
                <p className="font-medium">Payment received</p>
                <p className="text-sm text-gray-600">Customer: Jane Smith, Amount: ₹2,500</p>
                <p className="text-xs text-gray-400">Today, 09:15 AM</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50 rounded-r">
                <p className="font-medium">EMI overdue</p>
                <p className="text-sm text-gray-600">Customer: Mike Johnson, Amount: ₹3,200</p>
                <p className="text-xs text-gray-400">Yesterday, 11:45 AM</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;