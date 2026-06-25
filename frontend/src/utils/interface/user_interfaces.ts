export interface IProfile {
    first_name: string;
    last_name: string;
    phone?: string;
    adress?: string;
    url_photo?: string;
    username: string;
    email: string;
    role: 'admin' | 'worker' | 'client';
    }

export interface IUser extends IProfile {
    id: string;
    disabled: boolean;
    is_verified?: boolean;
    }

export interface IAuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean; // 💡 The guard gatekeeper flag
  lastTokenRefresh: number | null;
}

export interface IAuthActions {
  setUser: (user: IUser | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthenticated: (authenticated: boolean) => void;
  updateLastTokenRefresh: () => void;
  logout: () => void;
  clearAuth: () => void;
}

export type FilterRoleType = 'all' | 'admin' | 'worker' | 'client';
