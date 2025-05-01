import { useState } from 'react';

const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    twoFactor: false,
    defaultInterest: 12,
    defaultTerm: 12,
    processingFee: 2,
    lateFee: 1,
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setSettings({ ...settings, [name]: target.checked });
    } else {
      setSettings({ ...settings, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving settings:', settings);
    // Implement API call to save settings
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">General Settings</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium mb-2">Application Preferences</h3>
            <div className="flex items-center mb-4">
              <input
                id="notifications"
                name="notifications"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={settings.notifications}
                onChange={handleChange}
              />
              <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                Enable email notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="twoFactor"
                name="twoFactor"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={settings.twoFactor}
                onChange={handleChange}
              />
              <label htmlFor="twoFactor" className="ml-2 block text-sm text-gray-700">
                Enable two-factor authentication
              </label>
            </div>
          </div>
          
          <div className="border-t pt-5">
            <h3 className="text-md font-medium mb-2">Default Loan Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="defaultInterest" className="block text-sm font-medium text-gray-700">
                  Default Interest Rate (%)
                </label>
                <input
                  type="number"
                  id="defaultInterest"
                  name="defaultInterest"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={settings.defaultInterest}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="defaultTerm" className="block text-sm font-medium text-gray-700">
                  Default Loan Term (months)
                </label>
                <input
                  type="number"
                  id="defaultTerm"
                  name="defaultTerm"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={settings.defaultTerm}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="processingFee" className="block text-sm font-medium text-gray-700">
                  Processing Fee (%)
                </label>
                <input
                  type="number"
                  id="processingFee"
                  name="processingFee"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={settings.processingFee}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lateFee" className="block text-sm font-medium text-gray-700">
                  Late Payment Fee (%)
                </label>
                <input
                  type="number"
                  id="lateFee"
                  name="lateFee"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={settings.lateFee}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-5">
            <h3 className="text-md font-medium mb-2">Currency & Locale</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                  Default Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={settings.currency}
                  onChange={handleChange}
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              </div>
              <div>
                <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                  Date Format
                </label>
                <select
                  id="dateFormat"
                  name="dateFormat"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={settings.dateFormat}
                  onChange={handleChange}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;