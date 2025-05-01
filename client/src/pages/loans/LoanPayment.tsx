import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import PaymentForm from './PaymentForm';

// This component serves as a wrapper for the PaymentForm component
// It's created to satisfy the import in App.tsx
const LoanPayment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    // If no loan ID provided, redirect to the loans list
    return <Navigate to="/loans" />;
  }
  
  // Simply render the PaymentForm component, which already has all the functionality needed
  return <PaymentForm />;
};

export default LoanPayment;