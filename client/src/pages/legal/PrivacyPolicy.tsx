import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <svg className="h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700">Last Updated: May 1, 2025</p>
              
              <h2>1. Introduction</h2>
              <p>
                TrackFina ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you use our services, 
                including our website and mobile applications (collectively, the "Services").
              </p>
              
              <h2>2. Information We Collect</h2>
              <p>
                <strong>Personal Information:</strong> We may collect personal information such as your name, email address, 
                phone number, company details, and other information you provide when you register for an account, 
                use our Services, or communicate with us.
              </p>
              <p>
                <strong>Usage Data:</strong> We may collect information about how you interact with our Services, 
                including access times, pages viewed, and features used.
              </p>
              <p>
                <strong>Device Information:</strong> We may collect information about your device, including 
                IP address, browser type, operating system, and device identifiers.
              </p>
              
              <h2>3. How We Use Your Information</h2>
              <p>We may use the information we collect for various purposes, including to:</p>
              <ul>
                <li>Provide, maintain, and improve our Services</li>
                <li>Process transactions and manage your account</li>
                <li>Send you technical notices, updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our Services</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                <li>Comply with legal obligations</li>
              </ul>
              
              <h2>4. Data Sharing and Disclosure</h2>
              <p>
                We may share your information with:
              </p>
              <ul>
                <li>Service providers who perform services on our behalf</li>
                <li>Business partners with your consent or as necessary to provide services you've requested</li>
                <li>Legal authorities when required by law or to protect our rights or the rights of others</li>
              </ul>
              
              <h2>5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your data. 
                However, no method of transmission over the Internet or electronic storage is 100% secure. 
                Therefore, we cannot guarantee absolute security.
              </p>
              
              <h2>6. Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, 
                such as the right to access, correct, delete, or restrict processing of your data.
              </p>
              
              <h2>7. Children's Privacy</h2>
              <p>
                Our Services are not intended for individuals under 18 years of age. 
                We do not knowingly collect personal information from children.
              </p>
              
              <h2>8. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              
              <h2>9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                Email: privacy@trackfina.com
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

export default PrivacyPolicy;