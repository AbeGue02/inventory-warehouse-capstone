import { Text, TextInput, View } from "react-native";
import { globalStyles } from "../styles/global";

export default function TextField(props: {
  label: string;
  placeholder: string;
  returnKeyType?: "next" | "done";
  secureTextEntry?: boolean;
}) {
  return (
    <View style={globalStyles.formGroup}>
      <Text style={globalStyles.label}>{props.label}</Text>
      <TextInput
        style={globalStyles.textField}
        placeholder={props.placeholder}
        placeholderTextColor="#ccc"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType={props.returnKeyType || "next"}
        secureTextEntry={props.secureTextEntry || false}
      />
    </View>
  );
}
