import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { apiClient } from "../api/client";
import { ApiError } from "../api/client";
import type { User } from "../api/types";


interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      apiClient.setToken(authToken);
      const userData = await apiClient.getProfile();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      localStorage.removeItem("authToken");
      setToken(null);
      apiClient.setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting login with:", { email, backend: "http://localhost:8000" });
      const tokenData = await apiClient.login({ username: email, password });
      console.log("Login successful, received tokens");
      const authToken = tokenData.access;
      
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("refreshToken", tokenData.refresh);
      setToken(authToken);
      apiClient.setToken(authToken);
      
      console.log("Fetching user profile...");
      const userData = await apiClient.getProfile();
      console.log("Profile fetched successfully:", userData);
      setUser(userData);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      if (error instanceof ApiError) {
        console.error("API Error details:", { 
          status: error.status, 
          data: error.data,
          message: error.message 
        });
      } else if (error instanceof Error) {
        console.error("Network/Other Error:", error.message);
      }
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setUser(null);
    apiClient.setToken(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}