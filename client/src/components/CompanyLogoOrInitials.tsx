import React, { useState } from 'react';

interface Company {
  id: string;
  name: string;
  logo?: string;
}

interface CompanyLogoOrInitialsProps {
  company: Company;
  className?: string;
}

const CompanyLogoOrInitials: React.FC<CompanyLogoOrInitialsProps> = ({ 
  company, 
  className = "h-5 w-5 rounded-full mr-2" 
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Generate initials from company name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const initials = getInitials(company.name);

  if (!company.logo || imageError) {
    return (
      <div 
        className={`flex items-center justify-center bg-blue-600 text-white font-medium ${className}`}
      >
        {initials.substring(0, 2)}
      </div>
    );
  }

  return (
    <img 
      src={company.logo} 
      alt={company.name} 
      className={className}
      onError={() => setImageError(true)}
    />
  );
};

export default CompanyLogoOrInitials;