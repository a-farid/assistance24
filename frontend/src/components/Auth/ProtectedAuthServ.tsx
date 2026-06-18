'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/authStore';
import { authService } from '@/lib/auth/authService';
import { toast } from 'react-hot-toast';
import { AuthLoader } from './AuthLoader';
import { UnauthorizedAccess } from './UnauthorizedAccess';

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
  const { user, isLoading } = useAuthStore();
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
export default Protected;
