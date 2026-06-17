interface ProtectedProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  fallbackUrl?: string;
  showLoader?: boolean;
}

interface AuthGuardProps extends ProtectedProps {
  allowUnauthenticated?: boolean;
}