import { useRouter } from 'next/navigation';
import * as React from 'react';

import { AuthService } from '@/services/auth.service';
import { baseService } from '@/services/base/base.service';
import {
  UserInformationRegisterDto,
  UserInformationSignInDto,
} from '@/services/dtos/auth-dto.interface';

import { UserProfile } from '@/types/user.type';

// Define the shape of the context value
interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (credentials: UserInformationSignInDto) => Promise<void>;
  register: (userData: UserInformationRegisterDto) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  updateUser: (user: UserProfile) => void;
}

// Create the context with a default value
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  user?: UserProfile;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  user: userInitial,
}) => {
  const [user, setUser] = React.useState<UserProfile | null>(
    userInitial || null,
  );
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const authService = AuthService.getInstance(baseService);

  // Check if user is already logged in on mount
  React.useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (err) {
        // Clear invalid stored data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const updateUser = async (user: UserProfile) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const login = async (credentials: UserInformationSignInDto) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);

      // Store the token and user data
      localStorage.setItem('accessToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      setUser(response.user as unknown as UserProfile);
      setIsAuthenticated(true);

      // Redirect to dashboard or home page after successful login
      router.push('/');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to login';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: UserInformationRegisterDto) => {
    setLoading(true);
    setError(null);

    try {
      await authService.register(userData);
      // Redirect to login page after successful registration
      router.push('/sign-in');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to register';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear stored data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    // Reset state
    setUser(null);
    setIsAuthenticated(false);

    // Redirect to login page
    router.push('/sign-in');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        loading,
        error,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
