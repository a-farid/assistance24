/**
 * Example: Admin-only Page with Enhanced Protection
 * Shows how to implement role-based route protection
 */

'use client';

import React from 'react';
import { Protected } from '@/components/Auth/ProtectedRoute.enhanced';
import { useAuth } from '@/lib/auth/useAuth';

const AdminUsersPage = () => {
  const { user, hasRole } = useAuth();

  return (
    <Protected requiredRole="admin" fallbackUrl="/dashboard">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all users in the system
          </p>
        </div>

        {/* Admin-specific content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">1,234</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-green-600">1,180</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Pending Approval</h3>
            <p className="text-3xl font-bold text-yellow-600">54</p>
          </div>
        </div>

        {/* Show additional admin features if user has proper permissions */}
        {hasRole(['admin']) && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Add New User
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Bulk Actions
              </button>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
                Export Data
              </button>
            </div>
          </div>
        )}
      </div>
    </Protected>
  );
};

export default AdminUsersPage;
