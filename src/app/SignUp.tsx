import TextField from "@/components/TextField";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
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
  const { signUp } = useAuth();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

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
            value={name}
            onChangeText={setName}
            returnKeyType="next"
          />

          <TextField
            label="Email"
            placeholder="email@example.com"
            value={email}
            onChangeText={setEmail}
            returnKeyType="next"
          />

          <TextField
            label="Username"
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            returnKeyType="next"
          />

          <TextField
            label="Password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
          />

          {error && <Text style={{ color: "red" }}>{error}</Text>}

          <View style={globalStyles.formSpacer} />

          <TouchableOpacity
            style={globalStyles.primaryButton}
            onPress={async () => {
              // The auth guard redirects to the database select screen on success.
              setError(await signUp({ name, email, username, password }));
            }}
          >
            <Text style={globalStyles.primaryButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // Navigate to the Log In screen
              router.replace("/");
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
