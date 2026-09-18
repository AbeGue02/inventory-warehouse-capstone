/**
 * Root layout for the application. Serves as the rulebook for navigation and how the application handles global logic.
 */

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Root layout component that wraps the application with logic providers.
export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </AuthProvider>
  );
}

// Defines the stack navigator and its protected routes based on authentication status.
function RootNavigator() {
  const { isLoggedIn } = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen
          name="index"
          options={{ title: "Log In", headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          options={{ title: "Sign Up", headerShown: false }}
        />
      </Stack.Protected>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen
          name="DatabaseScreen"
          options={{ title: "Database", headerShown: false }}
        />
      </Stack.Protected>
    </Stack>
  );
}
