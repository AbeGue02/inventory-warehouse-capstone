/**
 * AuthContext
 * Provides authentication context and state management for the application.
 */

import { createContext, useContext, useMemo, useState } from "react";

// Defines the shape of the authentication context value.
interface AuthContextValue {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

// Creates the authentication context with default values.
const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

// Provides the authentication context to the component tree.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Manages the logged-in state of the user.
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Memoizes the context value to optimize performance and prevent unnecessary re-renders.
  // Memoization is used here to make sure that the context value only changes when the `isLoggedIn` state changes,
  // preventing unnecessary re-renders of child components.
  const value = useMemo(
    () => ({
      isLoggedIn,
      login: () => setIsLoggedIn(true),
      logout: () => setIsLoggedIn(false),
    }),
    [isLoggedIn], // Only re-render when isLoggedIn changes
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to access the authentication context.
// Throws an error if used outside of the AuthProvider.
// returns the authentication context value.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
