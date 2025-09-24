/**
 * Enhanced Protected Route Component
 * Provides faster, more secure route protection with better UX
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/authStore';
import { authService } from '@/lib/auth/authService';
import { toast } from 'react-hot-toast';

interface ProtectedProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  fallbackUrl?: string;
  showLoader?: boolean;
}

interface AuthGuardProps extends ProtectedProps {
  allowUnauthenticated?: boolean;
}

// Loading component with skeleton
const AuthLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-ping mx-auto"></div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Verifying authentication...
        </p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0ms]"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:100ms]"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:200ms]"></div>
        </div>
      </div>
    </div>
  </div>
);

// Unauthorized access component
const UnauthorizedAccess = ({ requiredRole, userRole }: { requiredRole?: string | string[], userRole?: string }) => (
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

/**
 * Enhanced Protected Component with role-based access control
 */
export const Protected: React.FC<ProtectedProps> = ({
  children,
  requiredRole,
  fallbackUrl = '/login',
  showLoader = true,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuthentication = async () => {
      try {
        setIsChecking(true);

        // Check if authentication is valid
        const isValid = await authService.checkAuth();
        
        if (!isMounted) return;

        if (!isValid) {
          toast.error('Please log in to continue');
          router.replace(fallbackUrl);
          return;
        }

        // Check role-based access
        if (requiredRole) {
          const hasRequiredRole = authService.hasRole(requiredRole);
          if (!hasRequiredRole) {
            setHasAccess(false);
            setIsChecking(false);
            return;
          }
        }

        // Check route-specific access
        const canAccessRoute = authService.canAccess(pathname);
        if (!canAccessRoute) {
          setHasAccess(false);
          setIsChecking(false);
          return;
        }

        setHasAccess(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        if (isMounted) {
          toast.error('Authentication failed');
          router.replace(fallbackUrl);
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    checkAuthentication();

    return () => {
      isMounted = false;
    };
  }, [pathname, requiredRole, fallbackUrl, router]);

  // Show loader while checking authentication
  if (isLoading || isChecking) {
    return showLoader ? <AuthLoader /> : null;
  }

  // Show unauthorized if user doesn't have access
  if (!hasAccess) {
    return <UnauthorizedAccess requiredRole={requiredRole} userRole={user?.role} />;
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};

/**
 * Auth Guard for conditional rendering based on authentication
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  allowUnauthenticated = false,
  ...protectedProps
}) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return protectedProps.showLoader !== false ? <AuthLoader /> : null;
  }

  if (!isAuthenticated && !allowUnauthenticated) {
    return null;
  }

  if (isAuthenticated && (protectedProps.requiredRole || !allowUnauthenticated)) {
    return <Protected {...protectedProps}>{children}</Protected>;
  }

  return <>{children}</>;
};

/**
 * Hook for using auth state in components
 */
export const useAuth = () => {
  const authState = useAuthStore();
  
  return {
    ...authState,
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    register: authService.register.bind(authService),
    hasRole: authService.hasRole.bind(authService),
    canAccess: authService.canAccess.bind(authService),
  };
};

export default Protected;
