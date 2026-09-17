import TextField from "@/components/TextField";
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
import { globalStyles } from "../styles/global";

export default function SignUp() {
  const router = useRouter();

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={globalStyles.screen}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <View style={globalStyles.card}>
          <Text style={globalStyles.cardTitle}>Sign Up</Text>

          <TextField
            label="Name"
            placeholder="First M. Last"
            returnKeyType="next"
          />

          <TextField
            label="Email"
            placeholder="email@example.com"
            returnKeyType="next"
          />

          <TextField
            label="Username"
            placeholder="Username"
            returnKeyType="next"
          />

          <TextField
            label="Password"
            placeholder="Password"
            secureTextEntry
            returnKeyType="done"
          />

          <View style={globalStyles.formSpacer} />

          <TouchableOpacity
            style={globalStyles.primaryButton}
            onPress={() => {
              // Handle the Sign Up action here
              router.push("/DatabaseScreen");
            }}
          >
            <Text style={globalStyles.primaryButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // Navigate to the Log In screen
              router.canGoBack() && router.back();
            }}
          >
            <Text style={globalStyles.signUpText}>
              I already have an account
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
