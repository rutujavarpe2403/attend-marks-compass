
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";

type User = {
  id: string;
  email: string;
  name: string;
  role: "teacher" | "student";
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

// Mock data for demonstration
const mockTeacher: User = {
  id: "t1",
  email: "teacher@school.edu",
  name: "John Smith",
  role: "teacher",
};

const mockStudent: User = {
  id: "s1",
  email: "student@school.edu",
  name: "Jane Doe",
  role: "student",
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for session on mount
    const checkSession = async () => {
      const storedUser = localStorage.getItem("eduUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, this would be a Supabase auth call
      // For now, we'll simulate with mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network request
      
      if (email === "teacher@school.edu" && password === "password") {
        setUser(mockTeacher);
        localStorage.setItem("eduUser", JSON.stringify(mockTeacher));
        toast.success("Logged in as Teacher");
      } else if (email === "student@school.edu" && password === "password") {
        setUser(mockStudent);
        localStorage.setItem("eduUser", JSON.stringify(mockStudent));
        toast.success("Logged in as Student");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed: " + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would be a Supabase auth call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network request
      localStorage.removeItem("eduUser");
      setUser(null);
      toast.info("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed: " + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
