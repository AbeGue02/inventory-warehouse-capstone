/*
 * Log In screen for the application.
 */

import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Index() {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: "purple" }]}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <View style={[styles.cardView, { width: "80%" }]}>
          <Text style={styles.cardTitle}>Log In</Text>

          <Text>Username</Text>
          <TextInput style={styles.textField} />
          <Text>Password</Text>
          <TextInput
            style={[styles.textField, { marginBottom: 0 }]}
            secureTextEntry
          />

          <TouchableOpacity
            style={{ justifyContent: "flex-start", borderRadius: 10 }}
          >
            <Text
              style={{
                textAlign: "center",
                marginVertical: 10,
                color: "purple",
              }}
            >
              Forgot password?
            </Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />

          <TouchableOpacity
            style={{
              width: "100%",
              backgroundColor: "purple",
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                marginVertical: 10,
                color: "white",
              }}
            >
              Log In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text
              style={{ textAlign: "center", marginTop: 10, color: "purple" }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  cardView: {
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  textField: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
});
