/**
 * TextField component
 * A reusable text input field with a label.
 * Made to keep other components clean and consistent
 */

import { Text, TextInput, View } from "react-native";
import { globalStyles } from "../styles/global";

export default function TextField(props: {
  label: string;
  placeholder: string;
  value?: string;
  editable?: boolean;
  returnKeyType?: "next" | "done";
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
}) {
  return (
    <View style={globalStyles.formGroup}>
      <Text style={globalStyles.label}>{props.label}</Text>
      <TextInput
        style={globalStyles.textField}
        placeholder={props.placeholder}
        value={props.value}
        editable={props.editable ?? true}
        placeholderTextColor="#ccc"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType={props.returnKeyType || "next"}
        secureTextEntry={props.secureTextEntry || false}
        onChangeText={props.onChangeText}
      />
    </View>
  );
}
