import React from 'react';
import { Users } from 'lucide-react';

const DemoUsers = ({ className = '' }) => {
  const demoUsers = [
    { name: 'John Smith', email: 'john@example.com' },
    { name: 'Sarah Johnson', email: 'sarah@example.com' },
    { name: 'Mike Chen', email: 'mike@example.com' },
    { name: 'Emily Davis', email: 'emily@example.com' },
    { name: 'Alex Rodriguez', email: 'alex@example.com' },
    { name: 'Lisa Wang', email: 'lisa@example.com' },
    { name: 'David Brown', email: 'david@example.com' }
  ];

  return (
            <div className={`mt-8 p-6 bg-gray-50 rounded-xl ${className}`}>
          <div className="flex items-center justify-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Demo Accounts
            </h3>
            <Users className="ml-2 w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-sm text-gray-600 text-center mb-6">
            Use these demo accounts to test the application:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            {demoUsers.map((user, index) => (
              <div key={index} className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                <div className="font-medium text-gray-800 text-sm mb-2 truncate" title={user.name}>{user.name}</div>
                <div className="text-gray-600 text-xs mb-2 break-words leading-tight" title={user.email}>{user.email}</div>
                <div className="text-green-600 font-medium text-xs cursor-pointer hover:underline">password</div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center">
            All demo accounts use the same password: <span className="text-green-600 font-medium cursor-pointer hover:underline">password</span>
          </p>
        </div>
  );
};

export default DemoUsers;
