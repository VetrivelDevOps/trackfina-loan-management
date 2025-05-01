import { Loan } from '../models/loan.model';
import { EMI, EMIStatus } from '../models/emi.model';
import { Payment } from '../models/payment.model';
import { sequelize } from '../config/database';
import { Op } from 'sequelize';

/**
 * Get transaction summary by date range
 * @param startDate Start date for the period
 * @param endDate End date for the period
 * @param branchId Optional branch ID for filtering
 * @param companyId Optional company ID for filtering
 */
export const getTransactionSummary = async (
  startDate: string,
  endDate: string,
  branchId?: string,
  companyId?: string
) => {
  const where: any = {
    paymentDate: {
      [Op.between]: [new Date(startDate), new Date(endDate)]
    }
  };

  // Apply additional filters if provided
  if (branchId || companyId) {
    // We need to join with EMI and Loan to filter by branch or company
    const payments = await Payment.findAll({
      include: [
        {
          model: EMI,
          required: true,
          include: [
            {
              model: Loan,
              required: true,
              where: {
                ...(branchId && { branchId }),
                ...(companyId && { companyId })
              }
            }
          ]
        }
      ],
      where
    });

    // Aggregate payment data
    const totalCollected = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const paymentsByMethod = payments.reduce((acc, payment) => {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + Number(payment.amount);
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCollected,
      transactionCount: payments.length,
      paymentsByMethod,
      dailyTotals: await getDailyTransactionTotals(startDate, endDate, branchId, companyId)
    };
  } else {
    // Simple aggregation without joins
    const totalCollected = await Payment.sum('amount', { where });
    const transactionCount = await Payment.count({ where });

    // Group by payment method
    const paymentsByMethodData = await Payment.findAll({
      attributes: [
        'paymentMethod', 
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      where,
      group: ['paymentMethod']
    });

    const paymentsByMethod = paymentsByMethodData.reduce((acc, item: any) => {
      acc[item.paymentMethod] = Number(item.getDataValue('total'));
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCollected,
      transactionCount,
      paymentsByMethod,
      dailyTotals: await getDailyTransactionTotals(startDate, endDate)
    };
  }
};

/**
 * Get daily transaction totals between start and end dates
 */
const getDailyTransactionTotals = async (
  startDate: string, 
  endDate: string,
  branchId?: string,
  companyId?: string
) => {
  // Complex query to get totals by day
  const query = `
    SELECT 
      DATE(payment_date) as date, 
      SUM(amount) as total, 
      COUNT(*) as count
    FROM payments
    ${branchId || companyId ? `
      INNER JOIN emis ON payments.emi_id = emis.id
      INNER JOIN loans ON emis.loan_id = loans.id
      WHERE 
        DATE(payment_date) BETWEEN :startDate AND :endDate
        ${branchId ? 'AND loans.branch_id = :branchId' : ''}
        ${companyId ? 'AND loans.company_id = :companyId' : ''}
    ` : `
      WHERE DATE(payment_date) BETWEEN :startDate AND :endDate
    `}
    GROUP BY DATE(payment_date)
    ORDER BY date ASC
  `;

  const [results] = await sequelize.query(query, {
    replacements: {
      startDate,
      endDate,
      ...(branchId && { branchId }),
      ...(companyId && { companyId })
    },
    type: sequelize.QueryTypes.SELECT
  });

  return results;
};

/**
 * Get loan performance metrics
 * @param period 'week', 'month', 'quarter', 'year'
 * @param companyId Optional company ID for filtering
 */
export const getLoanPerformanceMetrics = async (
  period: 'week' | 'month' | 'quarter' | 'year',
  companyId?: string
) => {
  const now = new Date();
  let startDate: Date;
  
  // Calculate the start date based on the period
  switch(period) {
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1); // Default to 1 month
  }

  // Filter by due date within the period
  const emiWhere: any = {
    dueDate: {
      [Op.between]: [startDate, now]
    }
  };

  // Apply company filter if provided
  if (companyId) {
    emiWhere['$loan.company_id$'] = companyId;
  }

  // Get all EMIs that were due in the period
  const emis = await EMI.findAll({
    where: emiWhere,
    include: [{
      model: Loan,
      attributes: ['id', 'companyId', 'branchId']
    }]
  });

  // Count EMIs by status
  const totalDue = emis.length;
  const paidOnTime = emis.filter(emi => 
    emi.status === EMIStatus.PAID && 
    new Date(emi.paidDate || 0) <= new Date(emi.dueDate)
  ).length;
  
  const paidLate = emis.filter(emi => 
    emi.status === EMIStatus.PAID && 
    new Date(emi.paidDate || 0) > new Date(emi.dueDate)
  ).length;
  
  const overdue = emis.filter(emi => emi.status === EMIStatus.OVERDUE).length;
  const pending = emis.filter(emi => emi.status === EMIStatus.PENDING).length;
  const partial = emis.filter(emi => emi.status === EMIStatus.PARTIAL).length;

  // Calculate percentages
  const paidOnTimePercentage = totalDue > 0 ? (paidOnTime / totalDue) * 100 : 0;
  const paidLatePercentage = totalDue > 0 ? (paidLate / totalDue) * 100 : 0;
  const overduePercentage = totalDue > 0 ? (overdue / totalDue) * 100 : 0;
  const pendingPercentage = totalDue > 0 ? (pending / totalDue) * 100 : 0;
  const partialPercentage = totalDue > 0 ? (partial / totalDue) * 100 : 0;

  return {
    period,
    totalDue,
    paidOnTime,
    paidLate,
    overdue,
    pending,
    partial,
    paidOnTimePercentage,
    paidLatePercentage,
    overduePercentage,
    pendingPercentage,
    partialPercentage,
    // Include total amounts
    totalDueAmount: emis.reduce((sum, emi) => sum + Number(emi.totalAmount), 0),
    paidAmount: emis
      .filter(emi => emi.status === EMIStatus.PAID)
      .reduce((sum, emi) => sum + Number(emi.totalAmount), 0),
    overdueAmount: emis
      .filter(emi => emi.status === EMIStatus.OVERDUE)
      .reduce((sum, emi) => sum + Number(emi.totalAmount), 0)
  };
};

/**
 * Forecast revenue based on upcoming EMIs
 * @param months Number of months to forecast (default 3)
 * @param companyId Optional company ID for filtering
 */
export const forecastRevenue = async (months = 3, companyId?: string) => {
  const now = new Date();
  const endDate = new Date(now);
  endDate.setMonth(now.getMonth() + months);

  // Filter for upcoming EMIs
  const where: any = {
    dueDate: {
      [Op.between]: [now, endDate]
    },
    status: {
      [Op.in]: [EMIStatus.PENDING, EMIStatus.PARTIAL]
    }
  };

  // Add company filter if provided
  if (companyId) {
    where['$loan.company_id$'] = companyId;
  }

  // Get all upcoming EMIs
  const emis = await EMI.findAll({
    where,
    include: [{
      model: Loan,
      attributes: ['id', 'companyId', 'branchId', 'customerId']
    }],
    order: [['dueDate', 'ASC']]
  });

  // Group EMIs by month
  const monthlyForecast = emis.reduce((acc, emi) => {
    const dueDate = new Date(emi.dueDate);
    const monthKey = `${dueDate.getFullYear()}-${dueDate.getMonth() + 1}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        expectedTotal: 0,
        expectedPrincipal: 0,
        expectedInterest: 0,
        emiCount: 0
      };
    }
    
    acc[monthKey].expectedTotal += Number(emi.totalAmount);
    acc[monthKey].expectedPrincipal += Number(emi.principalAmount);
    acc[monthKey].expectedInterest += Number(emi.interestAmount);
    acc[monthKey].emiCount++;
    
    return acc;
  }, {} as Record<string, any>);

  // Convert to array and sort by month
  const forecast = Object.values(monthlyForecast).sort((a, b) => 
    a.month.localeCompare(b.month)
  );

  // Calculate totals
  const totalExpected = forecast.reduce((sum, month) => sum + month.expectedTotal, 0);
  const totalPrincipal = forecast.reduce((sum, month) => sum + month.expectedPrincipal, 0);
  const totalInterest = forecast.reduce((sum, month) => sum + month.expectedInterest, 0);
  const totalCount = forecast.reduce((sum, month) => sum + month.emiCount, 0);

  return {
    forecastPeriodMonths: months,
    totalExpected,
    totalPrincipal,
    totalInterest,
    totalCount,
    monthlyForecast: forecast
  };
};

/**
 * Get loan analytics for dashboard
 */
export const getDashboardAnalytics = async (companyId?: string) => {
  // For dashboard, get a summary of key metrics
  const where = companyId ? { companyId } : {};
  
  // Total active loans
  const activeLoans = await Loan.count({
    where: {
      ...where,
      status: 'ACTIVE'
    }
  });
  
  // Total loan amount
  const totalLoanAmount = await Loan.sum('principalAmount', {
    where: {
      ...where
    }
  });
  
  // Get overdue EMIs
  const now = new Date();
  const overdueEmis = await EMI.count({
    where: {
      status: {
        [Op.in]: [EMIStatus.OVERDUE, EMIStatus.PENDING]
      },
      dueDate: {
        [Op.lt]: now
      }
    },
    include: [{
      model: Loan,
      where: where,
      attributes: []
    }]
  });
  
  // Get EMIs due this week
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + 7);
  
  const emisDueThisWeek = await EMI.count({
    where: {
      status: {
        [Op.in]: [EMIStatus.PENDING, EMIStatus.PARTIAL]
      },
      dueDate: {
        [Op.between]: [now, weekEnd]
      }
    },
    include: [{
      model: Loan,
      where: where,
      attributes: []
    }]
  });
  
  // Get total collected this month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const collectedThisMonth = await Payment.sum('amount', {
    where: {
      paymentDate: {
        [Op.between]: [monthStart, now]
      }
    },
    include: [{
      model: EMI,
      include: [{
        model: Loan,
        where: where,
        attributes: []
      }]
    }]
  }) || 0;

  return {
    activeLoans,
    totalLoanAmount,
    overdueEmis,
    emisDueThisWeek,
    collectedThisMonth
  };
};