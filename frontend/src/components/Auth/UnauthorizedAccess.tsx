/**
 * Enhanced Protected Route Component
 * Provides faster, more secure route protection with better UX
 */
'use client';
import React from 'react';

// Unauthorized access component
export const UnauthorizedAccess = ({ requiredRole, userRole }: { requiredRole?: string | string[]; userRole?: string; }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center space-y-6 p-8">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m12-5a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to access this page.
        </p>
        {requiredRole && (
          <p className="text-sm text-gray-500">
            Required role: {Array.isArray(requiredRole) ? requiredRole.join(', ') : requiredRole}
            {userRole && ` | Your role: ${userRole}`}
          </p>
        )}
      </div>
      <button
        onClick={() => window.history.back()}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
);
