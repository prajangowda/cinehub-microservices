import { useAuth as useAuthFromAuth } from '../auth/AuthContext.jsx';

export function useAuth() {
  return useAuthFromAuth();
}

export default useAuth;
