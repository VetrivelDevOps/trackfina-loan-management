/**
 * Format a number as currency
 * @param amount The amount to format
 * @param locale The locale to use for formatting (default: 'en-US')
 * @param currency The currency code to use (default: 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number, 
  locale: string = 'en-US', 
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Format a date string as a localized date
 * @param dateString The date string to format
 * @param locale The locale to use for formatting (default: 'en-US')
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string, 
  locale: string = 'en-US'
): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Calculate due date for next payment based on payment frequency and payment day
 * @param startDate Start date of the loan
 * @param paymentFrequency Payment frequency ('WEEKLY' or 'MONTHLY')
 * @param paymentDay Payment day (day of week 0-6 for weekly, day of month 1-31 for monthly)
 * @returns Next payment due date
 */
export const calculateNextPaymentDate = (
  startDate: Date,
  paymentFrequency: 'WEEKLY' | 'MONTHLY',
  paymentDay: number
): Date => {
  const today = new Date();
  let nextPayment = new Date(startDate);
  
  if (paymentFrequency === 'WEEKLY') {
    // For weekly payments, find the next occurrence of the weekday
    // paymentDay is 0-6 (Sunday-Saturday)
    const dayDiff = paymentDay - startDate.getDay();
    if (dayDiff > 0) {
      nextPayment.setDate(startDate.getDate() + dayDiff);
    } else {
      nextPayment.setDate(startDate.getDate() + 7 + dayDiff);
    }
    
    // Now find the next occurrence of this weekday that is not in the past
    while (nextPayment < today) {
      nextPayment.setDate(nextPayment.getDate() + 7);
    }
  } else {
    // For monthly payments, find the next occurrence of the day of month
    // paymentDay is 1-31
    nextPayment.setDate(paymentDay);
    
    // If the day has already passed this month, move to next month
    if (nextPayment < today) {
      nextPayment.setMonth(nextPayment.getMonth() + 1);
    }
    
    // Handle edge cases like 31st in months with fewer days
    while (nextPayment.getDate() !== paymentDay) {
      nextPayment.setDate(1);
      nextPayment.setMonth(nextPayment.getMonth() + 1);
      nextPayment.setDate(Math.min(paymentDay, getDaysInMonth(nextPayment.getFullYear(), nextPayment.getMonth() + 1)));
    }
  }
  
  return nextPayment;
};

/**
 * Helper function to get the number of days in a month
 * @param year The year
 * @param month The month (1-12)
 * @returns Number of days in the month
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

/**
 * Calculate EMI (Equated Monthly Installment) for a loan
 * @param principal Principal amount
 * @param rate Annual interest rate (in percentage)
 * @param tenure Tenure in months
 * @returns Monthly EMI amount
 */
export const calculateEMI = (
  principal: number,
  rate: number,
  tenure: number
): number => {
  const monthlyRate = rate / 12 / 100;
  const emi = principal * monthlyRate * (Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate total interest payable for a loan
 * @param principal Principal amount
 * @param emi EMI amount
 * @param tenure Tenure in months
 * @returns Total interest payable
 */
export const calculateTotalInterest = (
  principal: number,
  emi: number,
  tenure: number
): number => {
  const totalPayment = emi * tenure;
  const totalInterest = totalPayment - principal;
  return Math.round(totalInterest * 100) / 100; // Round to 2 decimal places
};