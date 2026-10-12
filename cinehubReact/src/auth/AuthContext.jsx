import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, login, logout, refreshAccessToken, register } from '../api/authApi.js';

const AuthContext = createContext(null);

export function extractUser(payload) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  if (payload.user && typeof payload.user === 'object') {
    return payload.user;
  }

  if (payload.data && typeof payload.data === 'object') {
    if (payload.data.user && typeof payload.data.user === 'object') {
      return payload.data.user;
    }

    if (payload.data.email || payload.data.id || payload.data._id) {
      return payload.data;
    }
  }

  if (payload.email || payload.id || payload._id) {
    return payload;
  }

  return null;
}

function isOtpResponse(payload) {
  if (!payload) {
    return false;
  }

  if (typeof payload === 'string') {
    return /otp/i.test(payload);
  }

  const hasOtpFlag = (obj) =>
    obj && typeof obj === 'object' && (
      obj.otpRequired ||
      obj.requiresOtp ||
      obj.otp_required ||
      (typeof obj.message === 'string' && /otp/i.test(obj.message)) ||
      (typeof obj.status === 'string' && /otp/i.test(obj.status))
    );

  return hasOtpFlag(payload) || hasOtpFlag(payload.data) || hasOtpFlag(payload.response);
}

export function isAdminUser(user) {
  if (!user || typeof user !== 'object') {
    return false;
  }

  return Boolean(
    user.isAdmin ||
    user.role === 'ADMIN' ||
    user.role === 'ROLE_ADMIN' ||
    user.roles?.includes('ADMIN') ||
    user.roles?.includes('ROLE_ADMIN')
  );
}

export function isOwnerUser(user) {
  if (!user || typeof user !== 'object') {
    return false;
  }

  return Boolean(
    user.role === 'THEATRE_OWNER' ||
    user.role === 'OWNER' ||
    user.role === 'theatre_owner' ||
    user.role === 'owner' ||
    user.roles?.includes('THEATRE_OWNER') ||
    user.roles?.includes('OWNER') ||
    user.roles?.includes('theatre_owner') ||
    user.roles?.includes('owner')
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const hasVisibleRefreshCookie = (() => {
        try {
          return typeof document !== 'undefined' && document.cookie && document.cookie.includes('refreshToken=');
        } catch (e) {
          return false;
        }
      })();

      // If a non-HttpOnly refresh cookie is present, try refresh first, then get current user.
      if (hasVisibleRefreshCookie) {
        try {
          await refreshAccessToken();
          const refreshedUser = await getCurrentUser();
          setUser(extractUser(refreshedUser));
          return;
        } catch (err) {
          // fallback to trying getCurrentUser below
          console.debug('Refresh-first attempt failed, falling back to getCurrentUser()', err);
        } finally {
          setIsLoading(false);
        }
      }

      // Default flow: try getCurrentUser() first, then attempt refresh+getCurrentUser() on failure.
      try {
        const data = await getCurrentUser();
        setUser(extractUser(data));
      } catch (error) {
        try {
          await refreshAccessToken();
          const refreshedUser = await getCurrentUser();
          setUser(extractUser(refreshedUser));
        } catch (refreshError) {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, []);

  const signIn = async (credentials) => {
    try {
      const loginResponse = await login(credentials);
      const extractedUser = extractUser(loginResponse);

      if (extractedUser) {
        setUser(extractedUser);
        return loginResponse;
      }

      try {
        const response = await getCurrentUser();
        const currentUser = extractUser(response);
        setUser(currentUser);
        return response;
      } catch (meError) {
        // The login itself succeeded but the backend did not include the user payload.
        // We still treat the login as successful and let the page redirect using the
        // authenticated session established by the server cookies.
        setUser(extractedUser);
        return loginResponse;
      }
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const signUp = async (credentials) => {
    try {
      const registerResponse = await register(credentials);
      console.debug('AuthContext signUp response:', registerResponse);
      const extractedUser = extractUser(registerResponse);
      const otpDetected = isOtpResponse(registerResponse);

      if (extractedUser && !otpDetected) {
        const response = await getCurrentUser();
        const currentUser = extractUser(response);
        setUser(currentUser);
        return response;
      }

      console.debug('AuthContext signUp otpDetected:', otpDetected);
      if (otpDetected) {
        return { otpRequired: true, payload: registerResponse };
      }

      return registerResponse;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await logout();
      setUser(null);
    } finally {
      // keep auth loading state for initial session restore only
    }
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = isAdminUser(user);
  const isOwner = isOwnerUser(user);

  const value = useMemo(
    () => ({ user, isLoading, isAuthenticated, isAdmin, isOwner, signIn, signUp, signOut, setUser }),
    [user, isLoading, isAuthenticated, isAdmin, isOwner]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;
