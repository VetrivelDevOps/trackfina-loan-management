import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCompany } from '../contexts/CompanyContext';
import Layout from '../components/Layout';

interface DashboardStats {
  totalCollections: number;
  pendingCollections: number;
  activeAgents: number;
  totalCustomers: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { currentCompany, currentBranch } = useCompany();
  const [stats, setStats] = useState<DashboardStats>({
    totalCollections: 5000,
    pendingCollections: 0,
    activeAgents: 1,
    totalCustomers: 2
  });
  
  const [dateFilter, setDateFilter] = useState('Last 30 Days');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch data based on selected company/branch
    if (currentCompany && currentBranch) {
      // Mock data update
      setTimeout(() => {
        setStats({
          totalCollections: 5000,
          pendingCollections: 0,
          activeAgents: 1,
          totalCustomers: 2
        });
      }, 300);
    }
  }, [currentCompany, currentBranch, dateFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(amount).replace('₹', '₹');
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        {/* Stats Cards - Updated with darker background colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Collections Card - Blue */}
          <div className="bg-blue-600 rounded-lg shadow-sm p-6 flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-25 text-white mr-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-100 font-medium">Total Collections</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-white">₹{stats.totalCollections.toLocaleString()}</p>
                <span className="ml-2 text-sm text-blue-100 font-medium flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                  </svg>12.5%
                </span>
              </div>
            </div>
          </div>

          {/* Pending Collections Card - Orange */}
          <div className="bg-orange-600 rounded-lg shadow-sm p-6 flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-25 text-white mr-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm text-orange-100 font-medium">Pending Collections</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-white">{stats.pendingCollections}</p>
                <span className="ml-2 text-sm text-orange-100 font-medium flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                  </svg>4.3%
                </span>
              </div>
            </div>
          </div>

          {/* Active Agents Card - Green */}
          <div className="bg-green-600 rounded-lg shadow-sm p-6 flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-25 text-white mr-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-green-100 font-medium">Active Agents</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-white">{stats.activeAgents}</p>
                <span className="ml-2 text-sm text-green-100 font-medium flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  8.7%
                </span>
              </div>
            </div>
          </div>

          {/* Total Customers Card - Purple */}
          <div className="bg-purple-600 rounded-lg shadow-sm p-6 flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-25 text-white mr-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-purple-100 font-medium">Total Customers</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-white">{stats.totalCustomers}</p>
                <span className="ml-2 text-sm text-purple-100 font-medium flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  15.2%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of your dashboard content */}
        {/* Charts, tables, etc. */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Chart Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Collection Trends</h2>
                  <p className="text-sm text-gray-500">Daily collection amounts for the last 30 days</p>
                </div>
                <div>
                  <select 
                    className="appearance-none bg-white border border-gray-300 text-gray-700 py-1 px-3 pr-8 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    defaultValue="Last 30 Days"
                  >
                    <option>Last 30 Days</option>
                    <option>This Month</option>
                    <option>Last Month</option>
                  </select>
                </div>
              </div>
              <div className="h-64">
                {/* Chart would go here - using a placeholder for now */}
                <div className="h-full w-full bg-gray-50 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-full h-40 relative">
                      {/* SVG Chart Placeholder */}
                      <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)" />
                            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,100 L0,90 C10,85 20,80 30,75 C40,70 50,65 60,70 C70,75 80,80 90,80 C100,80 110,75 120,70 C130,65 140,60 150,55 C160,50 170,45 180,45 C190,45 200,50 210,55 C220,60 230,65 240,70 C250,75 260,80 270,80 C280,80 290,75 300,65 C310,55 320,35 330,20 C340,5 350,0 360,10 C370,20 380,70 390,80 L400,90 L400,100 Z"
                          fill="url(#chartGradient)"
                        />
                        <path
                          d="M0,90 C10,85 20,80 30,75 C40,70 50,65 60,70 C70,75 80,80 90,80 C100,80 110,75 120,70 C130,65 140,60 150,55 C160,50 170,45 180,45 C190,45 200,50 210,55 C220,60 230,65 240,70 C250,75 260,80 270,80 C280,80 290,75 300,65 C310,55 320,35 330,20 C340,5 350,0 360,10 C370,20 380,70 390,80 L400,90"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                        />
                      </svg>
                      
                      {/* X-axis labels */}
                      <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 px-2">
                        <span>2 Apr</span>
                        <span>9 Apr</span>
                        <span>16 Apr</span>
                        <span>23 Apr</span>
                        <span>30 Apr</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-blue-500 inline-block mr-1"></span>
                        <span className="text-sm text-gray-500">Collection Amount</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Collections */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Collections</h2>
                  <a href="#" className="text-sm text-blue-600 hover:underline">View All</a>
                </div>
                <p className="text-sm text-gray-500 mb-4">Latest 5 collection transactions</p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {/* We'll add some example rows */}
                      {[...Array(3)].map((_, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                                {String.fromCharCode(65 + index)}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">Customer {index + 1}</div>
                                <div className="text-xs text-gray-500">ID: CUST-{1000 + index}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">₹{(2500 * (index + 1)).toLocaleString()}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Apr {29 - index}, 2023</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Top Performing Agents */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Top Performing Agents</h2>
                  <a href="#" className="text-sm text-blue-600 hover:underline">View All Agents</a>
                </div>
                <p className="text-sm text-gray-500 mb-4">Based on collection amounts this month</p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collections</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[...Array(3)].map((_, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                                {String.fromCharCode(65 + index)}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">Agent {index + 1}</div>
                                <div className="text-xs text-gray-500">ID: AGT-{1000 + index}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{10 - index * 2}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{98 - index * 3}%</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">₹{(5000 - index * 1000).toLocaleString()}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;