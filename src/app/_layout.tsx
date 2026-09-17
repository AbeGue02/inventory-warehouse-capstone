/**
 * Root layout for the application. Serves as the rulebook for navigation and how the application handles global logic.
 */

import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Log In",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SignUp"
          options={{
            title: "Sign Up",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DatabaseScreen"
          options={{
            title: "Database",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CompaniesScreen"
          options={{
            title: "Companies",
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
