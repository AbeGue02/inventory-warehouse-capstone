/**
 * Root layout for the application. Serves as the rulebook for navigation and how the application handles global logic.
 */

import { Stack } from "expo-router";
import {
  SafeAreaProvider
} from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Log In/Sign Up",
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
