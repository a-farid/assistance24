import { IAuthActions, IAuthState } from '@/utils/interface/user_interfaces';
import log from '@/utils/logger';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Centralized Access Control Rules Matrix
const accessRules: Record<string, string[]> = {
  '/admin': ['admin'],
  '/worker': ['worker', 'admin'],
  '/client': ['client', 'admin'],
  '/contracts': ['admin', 'worker', 'client'],
};

export const useAuthStore = create<IAuthState & IAuthActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      lastTokenRefresh: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (loading) => set({ isLoading: loading }),
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      updateLastTokenRefresh: () => set({ lastTokenRefresh: Date.now() }),
      logout: () => set({ user: null, isAuthenticated: false, lastTokenRefresh: null }),
      clearAuth: () => set({ user: null, isAuthenticated: false, isLoading: false, lastTokenRefresh: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (hydratedState, error) => {
        if (error) {
          log.error("Zustand", "Rehydration failed with critical framework exception:", error);
          useAuthStore.getState().setLoading(false);
          return;
        }
        if (hydratedState) {
          hydratedState.isLoading = false;
          log.info("Zustand", `Active profile complete. Context: ${hydratedState.user?.username || "Guest"}`);
        } else {
          useAuthStore.getState().setLoading(false);
        }
      }
    }
  )
);

/**
 * High-Performance Atomic Selectors & Access Utility Hook
 */
export function useAuthAuthorization() {
  // Pull fields atomically to minimize re-renders
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  const hasRole = (requiredRoles: string | string[]): boolean => {
    if (!user) return false;
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return rolesArray.includes(user.role);
  };

  const verifyRouteAccess = (currentPath: string): boolean => {
    if (!user) return false;
    for (const [routePath, allowedRoles] of Object.entries(accessRules)) {
      if (currentPath.startsWith(routePath)) {
        return allowedRoles.includes(user.role);
      }
    }
    return true; // Pass matching to general views
  };

  return { user, isLoading, isAuthenticated, hasRole, canAccess: verifyRouteAccess };
}