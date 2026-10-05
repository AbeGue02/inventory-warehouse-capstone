/**
 * AuthContext
 * Provides authentication and selected-database (company) state for the application.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface Company {
  _id: string;
  name: string;
  slug: string;
}

// Defines the shape of the authentication context value.
interface AuthContextValue {
  isLoggedIn: boolean;
  token: string | null; // JWT token for the authenticated user.
  company: Company | null;
  login: (username: string, password: string) => Promise<string | null>;
  signUp: (fields: {
    name: string;
    email: string;
    username: string;
    password: string;
  }) => Promise<string | null>;
  logout: () => void;
  selectCompany: (company: Company | null) => void; // Function to set the currently selected company.
  authFetch: (input: string, init?: RequestInit) => Promise<Response>; // Function to perform authenticated fetch requests with the Bearer token.
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);

  // Sends a request to an auth endpoint
  // I used useCallback to memoize the function and prevent unnecessary re-creations.
  // Using other hooks could cause unnecessary re-creations of the function
  const authenticate = useCallback(async (url: string, body: object) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) return result.error ?? "Authentication failed";
      setToken(result.token);
      return null;
    } catch {
      return "Unable to reach the server";
    }
  }, []);

  // Handles user login by calling the authenticate function with a username and password.
  const login = useCallback(
    (username: string, password: string) =>
      authenticate("/api/users", { username, password }),
    [authenticate],
  );

  // Handles user signup by calling the authenticate function with the provided fields.
  const signUp = useCallback(
    (fields: Parameters<AuthContextValue["signUp"]>[0]) =>
      authenticate("/api/signup", fields),
    [authenticate],
  );

  // Logs out the user by clearing the token and selected company.
  const logout = useCallback(() => {
    setToken(null);
    setCompany(null);
  }, []);

  // Fetch wrapper that attaches the Bearer token.
  // This makes it so all requests made with authFetch include the JWT token for authentication.
  const authFetch = useCallback(
    (input: string, init: RequestInit = {}) =>
      fetch(input, {
        ...init,
        headers: { ...init.headers, Authorization: `Bearer ${token}` },
      }),
    [token],
  );

  // Memoize the context value to prevent unnecessary rerenders of children components.
  const value = useMemo(
    () => ({
      isLoggedIn: token !== null,
      token,
      company,
      login,
      signUp,
      logout,
      selectCompany: setCompany,
      authFetch,
    }),
    [token, company, login, signUp, logout, authFetch],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider"); // Throws if used outside of the AuthProvider.
  }
  return context;
}
