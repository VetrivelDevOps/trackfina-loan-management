import Layout from '../../components/Layout';

const Reports = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Loan Summary</h2>
          <p className="text-gray-600 mb-4">
            View comprehensive summary of all active and completed loans.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Generate Report
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Payment Collections</h2>
          <p className="text-gray-600 mb-4">
            Review collection performance and outstanding amounts.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Generate Report
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Customer Analysis</h2>
          <p className="text-gray-600 mb-4">
            Analyze customer loan performance and payment behavior.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Generate Report
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Overdue Payments</h2>
          <p className="text-gray-600 mb-4">
            Identify loans with overdue payments that require follow-up.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Generate Report
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;