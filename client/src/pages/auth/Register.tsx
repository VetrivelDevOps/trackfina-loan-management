import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface CompanyDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  website: string;
  industry: string;
}

interface AdminUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const [step, setStep] = useState(1);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    website: '',
    industry: 'Finance',
  });
  
  const [adminUser, setAdminUser] = useState<AdminUser>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCompanyDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminUser(prev => ({ ...prev, [name]: value }));
  };

  const validateCompanyDetails = () => {
    if (!companyDetails.name) return "Company name is required";
    if (!companyDetails.phone) return "Phone number is required";
    return "";
  };

  const validateAdminUser = () => {
    if (!adminUser.firstName) return "First name is required";
    if (!adminUser.lastName) return "Last name is required";
    if (!adminUser.email) return "Email is required";
    if (!adminUser.password) return "Password is required";
    if (adminUser.password !== adminUser.confirmPassword) return "Passwords do not match";
    if (adminUser.password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const nextStep = () => {
    const error = validateCompanyDetails();
    if (error) {
      setError(error);
      return;
    }
    setError('');
    setStep(2);
  };

  const prevStep = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateAdminUser();
    if (error) {
      setError(error);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Register company and admin user
      await register({
        company: companyDetails,
        admin: {
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          email: adminUser.email,
          password: adminUser.password
        }
      });
      navigate('/login', { state: { registrationSuccess: true } });
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const industryOptions = [
    "Finance", 
    "Banking", 
    "Insurance", 
    "Lending", 
    "Microfinance",
    "Credit Union",
    "Other Financial Services"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl w-full flex">
        {/* Left side - Illustration (for larger screens) */}
        <div className="hidden lg:block lg:w-1/2 bg-blue-50 relative overflow-hidden">
          {/* Abstract blue shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-200 rounded-full opacity-30 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-300 rounded-full opacity-20 -ml-20 -mb-20"></div>
          
          <div className="flex items-center justify-center h-full relative z-10 p-12">
            {/* Illustration for registration */}
            <div>
              <div className="mb-8 flex justify-center">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="64" height="64" rx="32" fill="#3B82F6" />
                  <path d="M32 21.3333C29.0545 21.3333 26.2288 22.5607 24.1618 24.7454C22.0948 26.93 21 29.8986 21 32.9999C21 36.1012 22.0948 39.0698 24.1618 41.2544C26.2288 43.4391 29.0545 44.6666 32 44.6666C34.9455 44.6666 37.7712 43.4391 39.8382 41.2544C41.9052 39.0698 43 36.1012 43 32.9999C43 29.8986 41.9052 26.93 39.8382 24.7454C37.7712 22.5607 34.9455 21.3333 32 21.3333ZM26.75 31.3333C26.75 31.0683 26.8422 30.8144 27.0062 30.6269C27.1701 30.4394 27.3939 30.3333 27.625 30.3333H30.25V27.5833C30.25 27.3183 30.3422 27.0644 30.5062 26.8769C30.6701 26.6894 30.8939 26.5833 31.125 26.5833H32.875C33.1061 26.5833 33.3299 26.6894 33.4938 26.8769C33.6578 27.0644 33.75 27.3183 33.75 27.5833V30.3333H36.375C36.6061 30.3333 36.8299 30.4394 36.9938 30.6269C37.1578 30.8144 37.25 31.0683 37.25 31.3333V33.1666C37.25 33.4316 37.1578 33.6855 36.9938 33.873C36.8299 34.0605 36.6061 34.1666 36.375 34.1666H33.75V36.9166C33.75 37.1816 33.6578 37.4355 33.4938 37.623C33.3299 37.8105 33.1061 37.9166 32.875 37.9166H31.125C30.8939 37.9166 30.6701 37.8105 30.5062 37.623C30.3422 37.4355 30.25 37.1816 30.25 36.9166V34.1666H27.625C27.3939 34.1666 27.1701 34.0605 27.0062 33.873C26.8422 33.6855 26.75 33.4316 26.75 33.1666V31.3333Z" fill="white" />
                </svg>
              </div>

              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Start managing your loan business</h2>
                <p className="text-gray-600">TrackFina helps you track and manage loans efficiently</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Track loans and repayments</h3>
                    <p className="text-sm text-gray-500">Monitor all your loans in one place</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Manage multiple branches</h3>
                    <p className="text-sm text-gray-500">Centralize your operations across locations</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Generate reports</h3>
                    <p className="text-sm text-gray-500">Get insights with customized reports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Registration form */}
        <div className="w-full lg:w-1/2 py-12 px-8 md:px-16">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center">
              <svg className="h-8 w-8 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z" clipRule="evenodd" />
                <path d="M12 7.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900">TrackFina</h1>
            </div>
            <select className="text-sm text-gray-500 border border-gray-300 rounded-md px-3 py-1">
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign Up For Free</h2>
            <p className="text-gray-600">
              Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">Sign In</Link>
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'} mr-2`}>
                1
              </div>
              <div className={`h-1 flex-1 ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'} mx-2`}>
                2
              </div>
              <div className={`h-1 flex-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 ml-2`}>
                ✓
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">Company Details</span>
              <span className="text-xs text-gray-500">Admin Account</span>
              <span className="text-xs text-gray-500">Done</span>
            </div>
          </div>
          
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name*
                  </label>
                  <input 
                    id="name"
                    name="name"
                    type="text" 
                    value={companyDetails.name}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Finance Plus Inc."
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Address
                  </label>
                  <input 
                    id="address"
                    name="address"
                    type="text" 
                    value={companyDetails.address}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123 Business St."
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input 
                    id="city"
                    name="city"
                    type="text" 
                    value={companyDetails.city}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="City"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input 
                    id="state"
                    name="state"
                    type="text" 
                    value={companyDetails.state}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="State"
                  />
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input 
                    id="zipCode"
                    name="zipCode"
                    type="text" 
                    value={companyDetails.zipCode}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="12345"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number*
                  </label>
                  <input 
                    id="phone"
                    name="phone"
                    type="tel" 
                    value={companyDetails.phone}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(123) 456-7890"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input 
                    id="website"
                    name="website"
                    type="url" 
                    value={companyDetails.website}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="www.example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <select
                    id="industry"
                    name="industry" 
                    value={companyDetails.industry}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {industryOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out"
              >
                Continue to Admin Details
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name*
                  </label>
                  <input 
                    id="firstName"
                    name="firstName"
                    type="text" 
                    value={adminUser.firstName}
                    onChange={handleAdminChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name*
                  </label>
                  <input 
                    id="lastName"
                    name="lastName"
                    type="text" 
                    value={adminUser.lastName}
                    onChange={handleAdminChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Doe"
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address*
                  </label>
                  <div className="relative">
                    <input 
                      id="email"
                      name="email"
                      type="email" 
                      value={adminUser.email}
                      onChange={handleAdminChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="admin@company.com"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password*
                  </label>
                  <div className="relative">
                    <input 
                      id="password"
                      name="password"
                      type="password" 
                      value={adminUser.password}
                      onChange={handleAdminChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••••••"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password*
                  </label>
                  <div className="relative">
                    <input 
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password" 
                      value={adminUser.confirmPassword}
                      onChange={handleAdminChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••••••"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between gap-4 mb-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200 ease-in-out"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : "Create Account"}
                </button>
              </div>
            </form>
          )}
          
          <div className="text-center text-xs text-gray-500 mt-6">
            By signing up, you agree to our <Link to="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;