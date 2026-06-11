# Enhanced Protected Routes Migration Guide

This document explains how to migrate from your current protected routes system to the enhanced, more secure and faster implementation.

## 🚀 Key Improvements

### Security Enhancements
- ✅ Server-side JWT verification using the `jose` library
- ✅ Automatic token expiration checking
- ✅ Role-based access control at middleware level
- ✅ Secure token storage with persistence
- ✅ CSRF protection headers
- ✅ Prevention of token tampering

### Performance Improvements
- ✅ Singleton pattern for token refresh (prevents multiple simultaneous calls)
- ✅ Client-side state persistence with Zustand
- ✅ Faster route protection with server-side checks
- ✅ Reduced redundant API calls
- ✅ Better caching strategies
- ✅ Optimistic updates for better UX

### User Experience
- ✅ Enhanced loading states with skeleton UI
- ✅ Better error handling and messaging
- ✅ Graceful unauthorized access handling
- ✅ Seamless token refresh without user interruption

## 📦 Installation

```bash
cd frontend
npm install zustand@^4.4.7 jose@^5.2.0
```

## 🔄 Migration Steps

### 1. Replace Your Auth Store

**Before:**
```typescript
// Using Redux with complex setup
const authSlice = createSlice({...});
```

**After:**
```typescript
// Use the new Zustand-based auth store
import { useAuthStore } from '@/lib/auth/authStore';
```

### 2. Update Protected Components

**Before:**
```tsx
import Protected from '@/components/_hooks/Protected';

<Protected>
  {children}
</Protected>
```

**After:**
```tsx
import { Protected } from '@/components/Auth/ProtectedRoute.enhanced';

// Basic protection
<Protected>
  {children}
</Protected>

// Role-based protection
<Protected requiredRole="admin">
  {children}
</Protected>

// Multiple roles
<Protected requiredRole={["admin", "worker"]}>
  {children}
</Protected>
```

### 3. Update Your Layout

**Before:**
```tsx
// app/(protected)/layout.tsx
<div className="flex flex-row h-full">
  <nav><Navbar /></nav>
  <aside><Sidebar /></aside>
  <Protected>
    <main>{children}</main>
  </Protected>
</div>
```

**After:**
```tsx
// app/(protected)/layout.tsx
<Protected showLoader={true}>
  <div className="flex flex-row h-full">
    <nav><Navbar /></nav>
    <aside><Sidebar /></aside>
    <main className="flex-1 overflow-auto">{children}</main>
  </div>
</Protected>
```

### 4. Update Middleware (Optional but Recommended)

**Before:**
```typescript
// middleware.ts - Basic JWT decoding (insecure)
const decoded = JSON.parse(atob(token.split(".")[1]));
```

**After:**
```typescript
// middleware.enhanced.ts - Secure JWT verification
import { jwtVerify } from 'jose';
await verifyToken(token);
```

### 5. Update Login/Logout Components

**Before:**
```typescript
const [login] = useLoginMutation();
const [logout] = useLogoutMutation();
```

**After:**
```typescript
import { useAuth } from '@/lib/auth/useAuth';

const { login, logout, user, isAuthenticated } = useAuth();
```

### 6. Use New Auth Hook in Components

```tsx
import { useAuth } from '@/lib/auth/useAuth';

const MyComponent = () => {
  const { user, isAuthenticated, hasRole, canAccess } = useAuth();

  // Check if user has specific role
  if (!hasRole('admin')) {
    return <div>Access denied</div>;
  }

  // Check if user can access specific route
  if (!canAccess('/admin/users')) {
    return <div>Insufficient permissions</div>;
  }

  return <div>Admin content</div>;
};
```

## 🔧 Backend Requirements

Make sure your backend supports these endpoints:

```python
# Required endpoints
POST /auth/login      # Login with credentials
POST /auth/logout     # Logout and clear tokens
GET  /auth/refresh    # Refresh access token
POST /auth/register   # User registration
```

## 🛡️ Security Configuration

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://api.dev.local/api
JWT_SECRET_KEY=your-very-secure-secret-key
```

### Backend JWT Configuration

Ensure your backend JWT service includes:

- Short-lived access tokens (15 minutes)
- Long-lived refresh tokens (7 days)
- HttpOnly cookies for token storage
- Secure and SameSite cookie attributes

## 🎯 Role-Based Access Examples

### Page-Level Protection

```tsx
// Admin-only page
const AdminPage = () => (
  <Protected requiredRole="admin">
    <AdminContent />
  </Protected>
);

// Multiple roles allowed
const ContractsPage = () => (
  <Protected requiredRole={["admin", "worker", "client"]}>
    <ContractsContent />
  </Protected>
);
```

### Component-Level Protection

```tsx
const NavigationMenu = () => {
  const { hasRole } = useAuth();

  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      {hasRole('admin') && <Link href="/admin">Admin</Link>}
      {hasRole(['worker', 'admin']) && <Link href="/contracts">Contracts</Link>}
    </nav>
  );
};
```

## 📊 Performance Benefits

### Before (Current System)

- ❌ Multiple API calls on each route change
- ❌ No state persistence (lost on refresh)
- ❌ Redundant token refresh calls
- ❌ Client-side loading on every navigation

### After (Enhanced System)

- ✅ Single auth check with smart caching
- ✅ Persistent auth state across sessions
- ✅ Singleton token refresh pattern
- ✅ Fast route protection with middleware

## 🐛 Common Issues & Solutions

### Issue: "Module 'jose' not found"
```bash
npm install jose@^5.2.0
```

### Issue: "Module 'zustand' not found"
```bash
npm install zustand@^4.4.7
```

### Issue: Infinite loading state
Check that your backend refresh endpoint returns the correct format:
```json
{
  "success": true,
  "data": {
    "access_token": "...",
    "user": {...}
  }
}
```

### Issue: Unauthorized loops
Ensure your middleware excludes public routes and API endpoints.

## 🔄 Gradual Migration

You can migrate gradually:

1. **Phase 1**: Install dependencies and set up new auth store
2. **Phase 2**: Update one protected page to use new system
3. **Phase 3**: Update remaining pages
4. **Phase 4**: Replace middleware
5. **Phase 5**: Remove old Redux auth system

## 📞 Support

If you encounter issues during migration:
1. Check the console for detailed error messages
2. Verify backend endpoint responses match expected format
3. Ensure environment variables are set correctly
4. Test with a simple page first before migrating complex components

---

This enhanced system provides better security, performance, and user experience while maintaining backwards compatibility during migration.
