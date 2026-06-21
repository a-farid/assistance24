'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthAuthorization } from '@/lib/auth/authStore';
import { AuthLoader } from '../../app/(auth)/_components/AuthLoader';
import log from '@/utils/logger';
import { ProtectedProps } from '@/utils/interface/global';

export const Protected: React.FC<ProtectedProps> = ({ children, requiredRole, showLoader = true }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthAuthorization();

  // 💡 Architectural Fix: Manage navigation lifecycles inside an isolation hook
  useEffect(() => {
    // Hold evaluation until the store finishes loading from local memory
    if (isLoading) return;

    // If an unauthenticated profile tries to access a protected route, bounce them out
    if (!isAuthenticated || !user) {
      if (pathname !== '/login' && pathname !== '/register') {
        log.warn('Unauthenticated access attempt intercepted. Routing to login gateway.');
        router.replace('/login');
      }
    }
  }, [isAuthenticated, user, isLoading, pathname, router]);

  // 1. Initial State: Hold layout tree rendering while store hydrates from localStorage
  if (isLoading) {
    log.info('ProtectedRoute', 'Loading authentication state...');
    return showLoader ? <AuthLoader /> : null;
  }

  // 2. Structural Guard Boundary: If data is missing, render an empty buffer fragment while the useEffect redirect processes
  if (!isAuthenticated || !user) {
    if (pathname === '/login' || pathname === '/register') {
      return <>{children}</>;
    }
    return showLoader ? <AuthLoader /> : null;
  }

  // 3. Authorization Check: Validate explicitly targeted structural roles
  if (requiredRole) {
    const rolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!rolesArray.includes(user.role)) {
      log.warn('ProtectedRoute', `Authorization failed for role: ${user.role} on path: ${pathname}`);
      router.replace('/');
      return null;
    }
  }

  return <>{children}</>;
};

export default Protected;