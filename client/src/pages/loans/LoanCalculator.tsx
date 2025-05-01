import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { formatCurrency } from '../../utils/formatters';

interface LoanCalculation {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  amortization: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }>;
}

const LoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [loanTerm, setLoanTerm] = useState<number>(12);
  const [calculation, setCalculation] = useState<LoanCalculation | null>(null);
  
  const calculateLoan = () => {
    // Convert annual interest rate to monthly and decimal
    const monthlyRate = interestRate / 100 / 12;
    
    // Calculate EMI
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm) / 
                (Math.pow(1 + monthlyRate, loanTerm) - 1);
    
    // Calculate total payment over loan term
    const totalPayment = emi * loanTerm;
    
    // Calculate total interest
    const totalInterest = totalPayment - loanAmount;
    
    // Generate amortization schedule
    let remainingBalance = loanAmount;
    const amortization = [];
    
    for (let month = 1; month <= loanTerm; month++) {
      const interestForMonth = remainingBalance * monthlyRate;
      const principalForMonth = emi - interestForMonth;
      remainingBalance -= principalForMonth;
      
      amortization.push({
        month,
        payment: emi,
        principal: principalForMonth,
        interest: interestForMonth,
        remainingBalance: Math.max(0, remainingBalance)
      });
    }
    
    setCalculation({
      emi,
      totalInterest,
      totalPayment,
      amortization
    });
  };
  
  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm]);
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Loan Calculator</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                id="loanAmount"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                min="1000"
              />
            </div>
            
            <div>
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
                Interest Rate (% per annum)
              </label>
              <input
                type="number"
                id="interestRate"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                min="0.1"
                step="0.1"
              />
            </div>
            
            <div>
              <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">
                Loan Term (months)
              </label>
              <input
                type="number"
                id="loanTerm"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                min="1"
              />
            </div>
          </div>
        </div>
        
        {calculation && (
          <>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Loan Summary</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Monthly EMI</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">{formatCurrency(calculation.emi)}</dd>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Interest</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">{formatCurrency(calculation.totalInterest)}</dd>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Payment</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">{formatCurrency(calculation.totalPayment)}</dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Amortization Schedule</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Monthly breakdown of your loan payments.</p>
              </div>
              
              <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Month
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Principal
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Interest
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Remaining Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {calculation.amortization.slice(0, 12).map((row) => (
                        <tr key={row.month}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.month}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.payment)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.principal)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.interest)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.remainingBalance)}</td>
                        </tr>
                      ))}
                      
                      {calculation.amortization.length > 12 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            ...showing first 12 months of {calculation.amortization.length} total months.
                          </td>
                        </tr>
                      )}
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

export default LoanCalculator;