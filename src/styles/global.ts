import { StyleSheet } from "react-native";

export const colors = {
  primary: "purple",
  surface: "white",
  text: "#000",
  mutedText: "#ccc",
  onPrimary: "white",
  shadow: "#000",
};

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: colors.primary,
  },
  card: {
    width: "80%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    color: colors.text,
  },
  label: {
    color: colors.text,
    paddingVertical: 5,
    textAlign: "left",
  },
  formGroup: {
    width: "100%",
    marginBottom: 5,
  },
  textField: {
    borderWidth: 1,
    borderColor: colors.mutedText,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  textFieldLast: {
    marginBottom: 0,
  },
  linkButton: {
    justifyContent: "flex-start",
    borderRadius: 10,
  },
  linkText: {
    textAlign: "center",
    marginVertical: 10,
    color: colors.primary,
  },
  formSpacer: {
    height: 20,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  primaryButtonText: {
    textAlign: "center",
    marginVertical: 10,
    color: colors.onPrimary,
  },
  signUpText: {
    textAlign: "center",
    marginTop: 10,
    color: colors.primary,
  },
});
