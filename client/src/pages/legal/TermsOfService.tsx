import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
              <svg className="h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
                <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
              </svg>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700">Last Updated: May 1, 2025</p>
              
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using TrackFina's services, including our website, mobile applications, and any other services provided by TrackFina 
                (collectively referred to as the "Services"), you agree to be bound by these Terms of Service ("Terms"). 
                If you do not agree to these Terms, please do not use the Services.
              </p>
              
              <h2>2. Description of Services</h2>
              <p>
                TrackFina provides loan management software and related services for financial institutions and lending organizations. 
                Our Services allow users to track, manage, and analyze loan portfolios, customer relationships, repayments, 
                and other aspects of the lending business.
              </p>
              
              <h2>3. User Accounts</h2>
              <p>
                To use certain features of the Services, you must register for an account. You are responsible for 
                maintaining the confidentiality of your account information, including your password, 
                and for all activity that occurs under your account.
              </p>

              <h2>4. Privacy</h2>
              <p>
                Your use of the Services is also governed by our Privacy Policy, which can be found at 
                <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-800 px-1">Privacy Policy</Link>.
              </p>

              <h2>5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your data. 
                However, no method of transmission over the Internet or electronic storage is 100% secure. 
                Therefore, we cannot guarantee absolute security.
              </p>

              <h2>6. Subscription and Fees</h2>
              <p>
                Some of our Services are available on a subscription basis. You agree to pay all fees 
                associated with your subscription plan. Fees are non-refundable except as required by law or 
                as explicitly stated in these Terms.
              </p>

              <h2>7. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the Services at any time, 
                without prior notice or liability, for any reason, including if you breach these Terms.
              </p>

              <h2>8. Changes to Terms</h2>
              <p>
                We may modify these Terms at any time. We will notify you of material changes by posting 
                the updated Terms on our website or through the Services. Your continued use of the Services 
                after such modifications constitutes your acceptance of the modified Terms.
              </p>

              <h2>9. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], 
                without regard to its conflict of law provisions.
              </p>

              <h2>10. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
                <br />
                Email: support@trackfina.com
                <br />
                Address: TrackFina Headquarters, 123 Finance Street, Loanville, FL 12345
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;