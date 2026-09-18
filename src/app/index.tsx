/*
 * Log In screen for the application.
 */

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import TextField from "../components/TextField";
import { globalStyles } from "../styles/global";

export default function Index() {
  const router = useRouter(); // Extracts the router object for navigation within the application.
  const { login } = useAuth(); // Extracts the login function from the authentication context.

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={globalStyles.screen}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <View style={globalStyles.card}>
          <Text style={globalStyles.cardTitle}>Log In</Text>

          <TextField label="Username" placeholder="Username" />

          <TextField
            label="Password"
            placeholder="Password"
            secureTextEntry
            returnKeyType="done"
          />

          <TouchableOpacity style={globalStyles.linkButton}>
            <Text style={globalStyles.linkText}>Forgot password?</Text>
          </TouchableOpacity>

          <View style={globalStyles.formSpacer} />

          <TouchableOpacity
            style={globalStyles.primaryButton}
            onPress={() => {
              // Handle the Log In action here
              login();
              // router.replace("/DatabaseScreen");
            }}
          >
            <Text style={globalStyles.primaryButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // Navigate to the Sign Up screen
              router.replace("/SignUp");
            }}
          >
            <Text style={globalStyles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
